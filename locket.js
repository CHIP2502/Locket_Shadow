const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var body = $response.body;
var obj = JSON.parse(body);

// 1. Cấu hình nội dung hiển thị (Bạn sửa chữ trong ngoặc kép theo ý muốn)
const chu_hien_thi = "Zaara Dep Trai"; 
const ngay_he_thong = "2024-09-09T00:00:00Z";

var subscriptionData = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "9999-09-09T00:00:00Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: ngay_he_thong,
  purchase_date: ngay_he_thong,
  store: "app_store"
};

var entitlementData = {
  grace_period_expires_date: null,
  purchase_date: ngay_he_thong,
  product_identifier: "com.locket.Locket.premium.yearly",
  expires_date: "9999-09-09T00:00:00Z"
};

// 2. Xử lý logic Premium
const match = Object.keys(mapping).find(e => ua.includes(e));
if (match) {
  let [e, s] = mapping[match];
  if (s) {
    entitlementData.product_identifier = s;
    obj.subscriber.subscriptions[s] = subscriptionData;
  } else {
    obj.subscriber.subscriptions["com.locket.Locket.premium.yearly"] = subscriptionData;
  }
  obj.subscriber.entitlements[e] = entitlementData;
} else {
  obj.subscriber.subscriptions["com.locket.Locket.premium.yearly"] = subscriptionData;
  obj.subscriber.entitlements.pro = entitlementData;
}

// 3. CHIÊU CUỐI: Ép ghi đè toàn bộ chuỗi ngày tháng thành chữ custom
let finalBody = JSON.stringify(obj);
finalBody = finalBody.replace(/9 thg 9, 9999/g, chu_hien_thi);
finalBody = finalBody.replace(/September 9, 9999/g, chu_hien_thi);

$done({body: finalBody});
