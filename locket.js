const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

// Cấu hình dữ liệu "sạch" để hiện chữ "Đã là thành viên rồi"
var subscriptionData = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: null, // Để null để app hiện chữ mặc định
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: null,
  purchase_date: null,
  store: "app_store"
};

var entitlementData = {
  grace_period_expires_date: null,
  purchase_date: null,
  product_identifier: "com.locket.Locket.premium.yearly",
  expires_date: null
};

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

// Xóa triệt để các dấu vết ngày tháng cũ trong body response
const finalBody = JSON.stringify(obj).replace(/"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z"/g, "null");

$done({body: finalBody});
