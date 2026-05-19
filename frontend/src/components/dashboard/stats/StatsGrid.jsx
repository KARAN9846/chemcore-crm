import StatCard from "../common/StatCard";

const StatsGrid = ({ stats = [] }) => {
  if (!stats.length) {
    return null;
  }

  return (
    <section className="dashboard-stat-grid" aria-label="Dashboard stats">
      {stats.map((stat) => (
        <StatCard
          key={stat.id}
          icon={stat.icon}
          title={stat.title}
          value={stat.value}
          subtitle={stat.subtitle}
          trend={stat.trend}
          trendType={stat.trendType}
        />
      ))}
    </section>
  );
};

export default StatsGrid;
