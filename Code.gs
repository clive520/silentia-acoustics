/**
 * ==============================================================================
 * SILENTIA 耳機電商 - Google Apps Script (GAS) 後端資料庫程式碼
 * ==============================================================================
 * 
 * 【使用與部署步驟】：
 * 1. 在 Google 雲端硬碟建立一個新的「Google 試算表」，命名為「SILENTIA 耳機後端資料庫」。
 * 2. 點擊試算表上方功能表「擴充功能」 -> 「Apps Script」。
 * 3. 清空 Apps Script 編輯器內原本的內容，將本檔案的全部程式碼複製並貼上。
 * 4. 點擊上方工具列的「儲存」圖示 (Ctrl+S 或 Cmd+S)。
 * 5. 在上方下拉選單選擇「setupSheets」函式，點擊「執行」（首次執行會跳出權限授權，請允許權限）。
 *    執行完畢後回到試算表，您會看到「Orders」與「Reviews」兩個分頁已自動建置好並格式化！
 * 6. 點擊右上角藍色按鈕「部署」 -> 「新部署作業」：
 *    - 齒輪圖示選擇「網頁應用程式 (Web App)」
 *    - 說明填入：SILENTIA API v1
 *    - 誰可以存取：務必選擇「所有人 (Anyone)」
 *    - 點擊「部署」按鈕
 * 7. 複製產生的「網頁應用程式網址」(例如: https://script.google.com/macros/s/xxxx/exec)。
 * 8. 將該網址貼入前端專案的 `gas-service.js` 檔案中的 `apiUrl` 欄位即大功告成！
 */

// 試算表分頁名稱定義
const SHEET_NAMES = {
  ORDERS: 'Orders',
  REVIEWS: 'Reviews'
};

/**
 * 【一鍵初始化資料庫分頁】
 * 在 Apps Script 編輯器中手動點擊「執行 setupSheets」，自動建立並美化欄位標題
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. 初始化 Orders 分頁
  let orderSheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  if (!orderSheet) {
    orderSheet = ss.insertSheet(SHEET_NAMES.ORDERS);
  }
  
  const orderHeaders = [
    '訂單編號', '下單時間', '購買規格', '機身顏色', '訂單金額',
    '收件人姓名', '聯絡電話', '收件地址', '配送方式', '付款方式',
    '卡號末四碼', '銀行授權碼', '付款狀態', '出貨狀態', '物流單號'
  ];
  
  orderSheet.getRange(1, 1, 1, orderHeaders.length).setValues([orderHeaders]);
  formatHeaderRow(orderSheet, orderHeaders.length, '#1d1d1f'); // Apple 黑色風格標題列
  orderSheet.setFrozenRows(1);

  // 2. 初始化 Reviews 分頁
  let reviewSheet = ss.getSheetByName(SHEET_NAMES.REVIEWS);
  if (!reviewSheet) {
    reviewSheet = ss.insertSheet(SHEET_NAMES.REVIEWS);
  }

  const reviewHeaders = [
    '評價編號', '填寫時間', '顧客姓名', '職業/身分', '已購款式',
    '星等評分', '體驗標籤', '評價內容', '點讚數', '認證買家', '審核狀態'
  ];

  reviewSheet.getRange(1, 1, 1, reviewHeaders.length).setValues([reviewHeaders]);
  formatHeaderRow(reviewSheet, reviewHeaders.length, '#1d1d1f');
  reviewSheet.setFrozenRows(1);

  // 刪除預設的 Sheet1 (若存在且非唯一)
  const defaultSheet = ss.getSheetByName('工作表1') || ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try { ss.deleteSheet(defaultSheet); } catch (e) {}
  }

  Logger.log('✅ SILENTIA 試算表資料庫初始化完成！已建立 Orders 與 Reviews 分頁。');
}

/**
 * 美化標題列格式輔助函式
 */
function formatHeaderRow(sheet, colCount, bgColor) {
  const headerRange = sheet.getRange(1, 1, 1, colCount);
  headerRange.setBackground(bgColor);
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  headerRange.setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
}

/**
 * 處理 POST 請求（新增訂單、新增評價）
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({ success: false, error: '未接收到有效資料' });
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // ----------------------------------------------------
    // 行動 1: 新增訂單 (createOrder)
    // ----------------------------------------------------
    if (action === 'createOrder') {
      let sheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
      if (!sheet) {
        setupSheets();
        sheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
      }

      const rowData = [
        data.order_id || ('SIL' + Date.now()),
        data.order_date || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss'),
        data.product_edition || 'Silentia Pro 旗艦高階版',
        data.product_color || '晨曦乳白',
        Number(data.total_amount) || 5990,
        data.customer_name || '',
        data.customer_phone || '',
        data.shipping_address || '',
        data.shipping_method || '黑貓宅配 (免運)',
        data.payment_method || '信用卡一次付清 (綠界ECPay)',
        data.card_last4 || '',
        data.auth_code || '',
        data.payment_status || '已付款',
        '待出貨', // 出貨狀態預設值
        ''        // 物流單號預設空
      ];

      sheet.appendRow(rowData);
      
      // 設定儲存格文字對齊
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, rowData.length).setVerticalAlignment('middle');

      return createJsonResponse({
        success: true,
        message: '訂單已成功寫入 Google 試算表',
        order_id: data.order_id
      });
    }

    // ----------------------------------------------------
    // 行動 2: 新增評價 (createReview)
    // ----------------------------------------------------
    if (action === 'createReview') {
      let sheet = ss.getSheetByName(SHEET_NAMES.REVIEWS);
      if (!sheet) {
        setupSheets();
        sheet = ss.getSheetByName(SHEET_NAMES.REVIEWS);
      }

      const rowData = [
        data.review_id || ('REV' + Date.now()),
        data.created_at || Utilities.formatDate(new Date(), 'Asia/Taipei', 'yyyy/MM/dd HH:mm:ss'),
        data.author_name || '匿名買家',
        data.author_role || '已驗證買家',
        data.purchased_edition || 'Silentia Pro 旗艦版 (晨曦乳白)',
        Number(data.rating) || 5,
        data.tag || '音質',
        data.comment || '',
        Number(data.likes_count) || 1,
        true,    // 認證買家
        '已發佈' // 審核狀態預設已發佈
      ];

      sheet.appendRow(rowData);

      return createJsonResponse({
        success: true,
        message: '評價已成功儲存至 Google 試算表',
        review_id: data.review_id
      });
    }

    return createJsonResponse({ success: false, error: '未知的 action 指令: ' + action });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

/**
 * 處理 GET 請求（讀取評價清單、API 健康檢查）
 */
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // 讀取評價清單 (getReviews)
    if (action === 'getReviews') {
      const sheet = ss.getSheetByName(SHEET_NAMES.REVIEWS);
      if (!sheet || sheet.getLastRow() <= 1) {
        return createJsonResponse({ success: true, reviews: [] });
      }

      const values = sheet.getDataRange().getValues();
      const reviews = [];

      // 從第 2 列開始讀取 (略過標題列)
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const publishStatus = row[10];

        // 僅回傳審核狀態為「已發佈」的評價
        if (publishStatus === '已發佈') {
          reviews.push({
            review_id: row[0],
            created_at: formatDateTime(row[1]),
            author_name: row[2],
            author_role: row[3],
            purchased_edition: row[4],
            rating: Number(row[5]) || 5,
            tag: row[6],
            comment: row[7],
            likes_count: Number(row[8]) || 0,
            is_verified: Boolean(row[9])
          });
        }
      }

      // 依時間倒序排列（最新的在最前面）
      reviews.reverse();

      return createJsonResponse({
        success: true,
        reviews: reviews
      });
    }

    // 預設健康檢查訊息
    return createJsonResponse({
      success: true,
      message: 'SILENTIA 耳機後端 Google Apps Script API 運作正常！',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

/**
 * 格式化時間輔助
 */
function formatDateTime(val) {
  if (val instanceof Date) {
    return Utilities.formatDate(val, 'Asia/Taipei', 'yyyy/MM/dd');
  }
  return String(val);
}

/**
 * 產生 JSON 格式之 HTTP 回應
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
