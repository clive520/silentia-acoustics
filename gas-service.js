/**
 * ==============================================================================
 * SILENTIA - Google Apps Script (GAS) 後端資料庫通訊模組
 * ==============================================================================
 * 本模組負責將前端網頁之「訂單資料」與「顧客評價」即時同步寫入至 Google 試算表。
 * 
 * 部署設定指南：
 * 1. 在 Google 雲端硬碟建立新的 Google 試算表。
 * 2. 點擊頂部選單「擴充功能」->「Apps Script」。
 * 3. 貼上後端程式碼（詳見專案內的 Code.gs / google_apps_script.js）。
 * 4. 點擊「部署」->「新部署作業」-> 類型選擇「網頁應用程式 (Web App)」。
 * 5. 設定存取權限為「所有人 (Anyone)」，點擊部署並複製取得之 Web 應用程式網址。
 * 6. 將網址貼入下方的 `apiUrl` 欄位中即可完成連線！
 */

const GAS_CONFIG = {
  // 請在此填入您的 Google Apps Script 網頁應用程式網址 (Web App URL)
  // 例如：'https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXXXXXXXXXXX/exec'
  apiUrl: '', 

  // 是否在瀏覽器主控台顯示通訊日誌
  debug: true
};

class GASBackendService {
  /**
   * 送出訂單資料至 Google 試算表 (Orders 分頁)
   * @param {Object} orderData 訂單明細
   */
  static async syncOrder(orderData) {
    if (!GAS_CONFIG.apiUrl) {
      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 提醒：尚未設定 GAS_CONFIG.apiUrl，目前以純前端展示模式運作。訂單明細：', orderData);
      }
      return { success: true, mocked: true };
    }

    try {
      const payload = {
        action: 'createOrder',
        order_id: orderData.tradeNo || ('SIL' + Date.now()),
        order_date: orderData.tradeDate || new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
        product_edition: orderData.productEdition || 'Silentia Pro 旗艦高階版',
        product_color: '晨曦乳白',
        total_amount: Number(orderData.amount) || 5990,
        customer_name: orderData.customerName,
        customer_phone: orderData.customerPhone,
        shipping_address: orderData.shippingAddress,
        shipping_method: orderData.shippingMethod || '黑貓宅配 (免運)',
        payment_method: '信用卡一次付清 (綠界ECPay)',
        card_last4: orderData.cardLast4 || '8888',
        auth_code: orderData.authCode || 'EC000000',
        payment_status: '已付款'
      };

      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 正在傳送訂單資料至 Google 試算表...', payload);
      }

      // 使用 text/plain 避免觸發跨網域預檢 (CORS preflight OPTIONS)
      const response = await fetch(GAS_CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json();
      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 訂單成功儲存至試算表：', resJson);
      }
      return resJson;
    } catch (err) {
      console.warn('[GAS Backend] 訂單儲存至 Google 試算表時發生錯誤（不影響消費者介面）：', err);
      return { success: false, error: err };
    }
  }

  /**
   * 送出顧客真實評價至 Google 試算表 (Reviews 分頁)
   * @param {Object} reviewData 評價內容
   */
  static async syncReview(reviewData) {
    if (!GAS_CONFIG.apiUrl) {
      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 提醒：尚未設定 GAS_CONFIG.apiUrl，目前以純前端展示模式運作。評價明細：', reviewData);
      }
      return { success: true, mocked: true };
    }

    try {
      const payload = {
        action: 'createReview',
        review_id: 'REV' + (reviewData.id || Date.now()),
        created_at: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
        author_name: reviewData.name,
        author_role: reviewData.role || '聲學愛好者',
        purchased_edition: reviewData.edition,
        rating: Number(reviewData.rating) || 5,
        tag: reviewData.tag || '音質',
        comment: reviewData.comment,
        likes_count: Number(reviewData.likes) || 1,
        is_verified: true,
        publish_status: '已發佈'
      };

      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 正在傳送評價資料至 Google 試算表...', payload);
      }

      const response = await fetch(GAS_CONFIG.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });

      const resJson = await response.json();
      if (GAS_CONFIG.debug) {
        console.log('[GAS Backend] 評價成功儲存至試算表：', resJson);
      }
      return resJson;
    } catch (err) {
      console.warn('[GAS Backend] 評價儲存至 Google 試算表時發生錯誤：', err);
      return { success: false, error: err };
    }
  }

  /**
   * 從 Google 試算表獲取所有已核准之評價
   */
  static async fetchReviews() {
    if (!GAS_CONFIG.apiUrl) return null;

    try {
      const fetchUrl = `${GAS_CONFIG.apiUrl}?action=getReviews&_t=${Date.now()}`;
      const response = await fetch(fetchUrl);
      const data = await response.json();
      if (data && data.success && Array.isArray(data.reviews)) {
        return data.reviews;
      }
    } catch (err) {
      console.warn('[GAS Backend] 讀取試算表評價清單失敗，將維持使用預設展示評價：', err);
    }
    return null;
  }
}

// 導出全域物件
window.GASBackendService = GASBackendService;
window.GAS_CONFIG = GAS_CONFIG;
