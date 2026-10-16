/**
 * ==============================================================================
 * 綠界科技 ECPay 金流整合模組 (ECPay Integration Architecture)
 * ==============================================================================
 * 本模組提供「信用卡線上訂購」與未來直接串接「綠界科技 ECPay 全方位金流」之標準架構。
 *
 * 官方串接規格：
 * - 綠界測試環境端點：https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5
 * - 綠界正式環境端點：https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5
 *
 * 安全建議：
 * 綠界檢查碼 CheckMacValue 與 HashKey / HashIV 建議於後端（Node.js / Python / PHP 等）計算，
 * 避免金鑰暴露於前端客戶端。本模組預留完整欄位結構與轉向 Form POST 機制。
 */

const ECPayConfig = {
  // 目前運行模式：'mock' (擬真即時測試) 或 'live' (送往綠界收銀台)
  mode: 'mock', 

  // 綠界特店設定（以下為綠界官方公開測試參數，上線時請替換為您的正式商店資料）
  stage: {
    serviceUrl: 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5',
    MerchantID: '3002607', // 綠界測試特店編號
    HashKey: 'pwsystem',     // 測試 HashKey (僅供參考，應置於伺服端)
    HashIV: 'pamsetas'       // 測試 HashIV (僅供參考，應置於伺服端)
  },
  
  production: {
    serviceUrl: 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5',
    MerchantID: 'YOUR_MERCHANT_ID', // 請填入您申請通過之綠界特店代號
    HashKey: 'YOUR_HASH_KEY',
    HashIV: 'YOUR_HASH_IV'
  },

  // 交易完成導回網址設定
  callbackUrls: {
    ReturnURL: 'https://yourdomain.com/api/ecpay/notify',    // 伺服器端接收付款通知
    OrderResultURL: window.location.origin + window.location.pathname, // 消費者刷卡完成導回頁面
    ClientBackURL: window.location.origin + window.location.pathname   // 消費者取消交易返回頁面
  }
};

class ECPayService {
  /**
   * 產生隨機且唯一的特店訂單編號 (長度不超過 20 碼)
   */
  static generateTradeNo() {
    const timestamp = Date.now().toString().slice(-8);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `SIL${timestamp}${randomSuffix}`;
  }

  /**
   * 取得標準綠界格式當前時間 (yyyy/MM/dd HH:mm:ss)
   */
  static getFormattedDate() {
    const d = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  /**
   * 建構發送至綠界收銀台的標準表單參數封裝
   * @param {Object} orderData 訂單明細
   */
  static buildPaymentPayload(orderData) {
    const isProd = ECPayConfig.mode === 'live';
    const activeEnv = isProd ? ECPayConfig.production : ECPayConfig.stage;

    return {
      MerchantID: activeEnv.MerchantID,
      MerchantTradeNo: this.generateTradeNo(),
      MerchantTradeDate: this.getFormattedDate(),
      PaymentType: 'aio',
      TotalAmount: orderData.amount.toString(),
      TradeDesc: encodeURIComponent('SILENTIA 晨曦乳白旗艦耳機訂購'),
      ItemName: `${orderData.productName} (乳白色)#NT$${orderData.amount}#1`,
      ReturnURL: ECPayConfig.callbackUrls.ReturnURL,
      OrderResultURL: ECPayConfig.callbackUrls.OrderResultURL,
      ClientBackURL: ECPayConfig.callbackUrls.ClientBackURL,
      ChoosePayment: 'Credit', // 預設指定為信用卡一次付清
      EncryptType: '1',        // SHA256 驗證
      CustomField1: orderData.customerName,
      CustomField2: orderData.customerPhone,
      CustomField3: orderData.shippingAddress
    };
  }

  /**
   * 執行結帳流程
   * - 若在 mock 模式下：執行高擬真驗證動畫，回傳完整電子訂購憑證
   * - 若在 live 模式下：動態生成 HTML Form 表單並 POST 轉向至綠界安全收銀台
   */
  static async processCheckout(orderData) {
    const payload = this.buildPaymentPayload(orderData);

    if (ECPayConfig.mode === 'live') {
      // 建立動態表單送往綠界
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = ECPayConfig.production.serviceUrl;
      form.style.display = 'none';

      for (const [key, value] of Object.entries(payload)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
      return { success: true, redirecting: true };
    }

    // --- 擬真結帳流程 (模擬安全銀行 3D 授權與綠界扣款通訊) ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          tradeNo: payload.MerchantTradeNo,
          tradeDate: payload.MerchantTradeDate,
          amount: payload.TotalAmount,
          itemName: payload.ItemName,
          cardLast4: orderData.cardNumber ? orderData.cardNumber.slice(-4) : '8888',
          authCode: 'EC' + Math.floor(100000 + Math.random() * 900000),
          customerName: orderData.customerName,
          shippingAddress: orderData.shippingAddress
        });
      }, 1500);
    });
  }
}

// 導出全域物件供前端頁面調用
window.ECPayService = ECPayService;
window.ECPayConfig = ECPayConfig;
