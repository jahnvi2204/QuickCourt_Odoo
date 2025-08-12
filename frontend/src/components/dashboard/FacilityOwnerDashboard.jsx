const FacilityOwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 124,
    activeCourts: 8,
    earnings: 15420,
    bookingCalendar: []
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Facility Dashboard</h1>
        <p className="text-gray-600 mt-2">Monitor your facility performance and bookings</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Calendar className="h-10 w-10" />
            <div className="ml-4">
              <p className="text-blue-100">Total Bookings</p>
              <p className="text-3xl font-bold">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <Activity className="h-10 w-10" />
            <div className="ml-4">
              <p className="text-green-100">Active Courts</p>
              <p className="text-3xl font-bold">{stats.activeCourts}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <DollarSign className="h-10 w-10" />
            <div className="ml-4">
              <p className="text-purple-100">Total Earnings</p>
              <p className="text-3xl font-bold">${stats.earnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center">
            <TrendingUp className="h-10 w-10" />
            <div className="ml-4">
              <p className="text-orange-100">Growth</p>
              <p className="text-3xl font-bold">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Trends</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Line chart showing booking trends would go here</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Summary</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Bar chart showing revenue by month would go here</p>
          </div>
        </div>
      </div>
    </div>
  );
};
