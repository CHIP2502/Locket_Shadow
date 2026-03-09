const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold']
};

var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
var obj = JSON.parse($response.body);

// 1. CHỮ BẠN MUỐN HIỂN THỊ (Sửa ở đây)
const CHU_CUSTOM = "Vĩnh Viễn Bởi Nobi"; 

var subscriptionData = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "9999-09-09T00:00:00Z",
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: "2024-09-09T00:00:00Z",
  purchase_date: "2024-09-09T00:00:00Z",
  store: "app_store"
};

var entitlementData = {
  grace_period_expires_date: null,
  purchase_date: "2024-09-09T00:00:00Z",
  product_identifier: "com.locket.Locket.premium.yearly",
  expires_date: "9999-09-09T00:00:00Z"
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

// 2. CHIÊU CUỐI: Chèn thêm các trường giả lập để ép App hiển thị text
// Một số phiên bản RevenueCat sẽ ưu tiên đọc các trường định dạng sẵn này
if (obj.subscriber.subscriptions) {
    Object.keys(obj.subscriber.subscriptions).forEach(key => {
        obj.subscriber.subscriptions[key].expires_date = CHU_CUSTOM;
        obj.subscriber.subscriptions[key].purchase_date = CHU_CUSTOM;
    });
}
if (obj.subscriber.entitlements) {
    Object.keys(obj.subscriber.entitlements).forEach(key => {
        obj.subscriber.entitlements[key].expires_date = CHU_CUSTOM;
    });
}

$done({body: JSON.stringify(obj)});
