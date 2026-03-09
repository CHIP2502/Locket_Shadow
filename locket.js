const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

// Thay đổi các giá trị chữ ở đây theo ý thích của bạn
const chu_vinh_vien = "Zaara Dep Trai";
const chu_ngay_mua = "Zaara Dep Trai";

obj.Attention = "Gói cước đã được mở khóa!";

var subscriptionData = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: chu_vinh_vien, // Chuyển thành chữ
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: chu_ngay_mua, // Chuyển thành chữ
  purchase_date: chu_ngay_mua, // Chuyển thành chữ
  store: "app_store"
};

var entitlementData = {
  grace_period_expires_date: null,
  purchase_date: chu_ngay_mua,
  product_identifier: "com.locket.Locket.premium.yearly",
  expires_date: chu_vinh_vien
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

$done({body: JSON.stringify(obj)});
