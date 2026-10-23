# SILENTIA | 純粹乳白・無界寂境 旗艦耳罩式無線耳機

> 官方線上展示頁面：[https://clive520.github.io/silentia-acoustics/](https://clive520.github.io/silentia-acoustics/)

---

## 🌟 網站特色
1. **全方位晨曦乳白美學**：極致簡約溫潤純白配色，無黑色款，Apple 官方級流暢動效。
2. **360° 工藝三視圖**：提供主視圖、正視圖、側視圖與特寫視圖切換，帶有互動式微動態 Hotspots。
3. **即時聲波視覺儀**：Canvas 即時模擬主動降噪 (ANC -40dB) 與環境通透模式 (0dB)。
4. **雙規格方案與規格比較表**：普通版 (NT$ 3,990) vs Pro 旗艦高階版 (NT$ 5,990)。
5. **真實使用者評價系統**：4.9 顆星滿意評分，支援動態填寫評價。
6. **信用卡線上結帳與 ECPay 綠界架構**：擬真 3D 授權防呆驗證，可無縫串接綠界金流。
7. **Google 試算表後端 (GAS)**：透過 Google Apps Script 即時寫入訂單與評價資料庫。

---

## 📊 Google 試算表後端 (Google Apps Script) 串接說明

本專案採用 **Google 試算表** 作為無伺服器（Serverless）後端資料庫。

### 步驟 1：建立試算表並貼上後端程式碼
1. 在 Google 雲端硬碟建立一個新的試算表，命名為 `SILENTIA 耳機後端資料庫`。
2. 點擊頂部功能表「**擴充功能**」->「**Apps Script**」。
3. 清空編輯器原本內容，將專案中的 [`Code.gs`](./Code.gs) 內容完整複製並貼上。
4. 儲存專案 (Ctrl+S / Cmd+S)。

### 步驟 2：一鍵初始化資料庫欄位
1. 在 Apps Script 上方功能列的函式下拉選單中選擇 `setupSheets`。
2. 點擊「**執行**」（初次執行請允許 Google 帳號授權）。
3. 回到 Google 試算表，您會發現已自動建立好 `Orders`（訂單）與 `Reviews`（評價）兩個已格式化的分頁！

### 步驟 3：部署為網頁應用程式 (Web App)
1. 點擊 Apps Script 右上角的藍色「**部署**」按鈕 ->「**新部署作業**」。
2. 類型點選齒輪圖示，選擇「**網頁應用程式 (Web App)**」。
3. 設定：
   - **說明**：`SILENTIA Backend v1`
   - **執行身分**：`我 (您的 Google 帳號)`
   - **誰可以存取**：務必設定為「**所有人 (Anyone)**」
4. 點擊「**部署**」，並複製產生的「**網頁應用程式網址**」(以 `https://script.google.com/macros/s/.../exec` 結尾)。

### 步驟 4：填入前端網頁
在前端專案的 [`gas-service.js`](./gas-service.js) 檔案中，將網址貼入 `apiUrl`：
```javascript
const GAS_CONFIG = {
  apiUrl: '您的網頁應用程式網址',
  debug: true
};
```
存檔並推播至 GitHub 後，前台的訂單與顧客回饋將會即時同步存入您的 Google 試算表！
