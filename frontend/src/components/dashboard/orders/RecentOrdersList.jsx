import DashboardPanel from "../common/DashboardPanel";

const RecentOrdersList = ({ orders = [] }) => {
  if (!orders?.length) {
    return null;
  }

  return (
    <DashboardPanel
      title="Recent Orders - All Teams"
      titleIcon="bi-cart-check-fill"
      actionText="View all"
      actionLink="/dashboard/orders"
    >
      <div className="dashboard-order-list">
        {orders.map((order) => (
          <article key={order.id} className="dashboard-order-card">
            <div className="dashboard-order-identity">
              <span className="dashboard-order-avatar">{order.avatar}</span>
              <div className="dashboard-order-main">
                <span className="dashboard-order-number">
                  {order.orderNumber}
                </span>
                <h3>{order.customer}</h3>
                <p>{order.detail}</p>
              </div>
            </div>

            <span
              className={`dashboard-order-status dashboard-order-status-${order.statusVariant}`}
            >
              {order.status}
            </span>
          </article>
        ))}
      </div>
    </DashboardPanel>
  );
};

export default RecentOrdersList;
