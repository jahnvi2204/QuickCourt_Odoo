const Dashboard = () => {
  const { user } = useAuth();

  if (user?.role === 'facility_owner') {
    return <FacilityOwnerDashboard />;
  } else if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

// User Dashboard
const UserDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0
  });

  useEffect(() => {
    // Mock data
    setBookings([
      {
        _id: '1',
        facility: { name: 'Elite Sports Complex', address: { city: 'Mumbai' } },
        court: { name: 'Court 1', sportType: 'Badminton' },
        date: new Date('2024-12-15'),
        startTime: '18:00',
        endTime: '19:00',
        status: 'confirmed',
        totalAmount: 30
      },
      {
        _id: '2',
        facility: { name: 'Victory Sports Arena', address: { city: 'Delhi' } },
        court: { name: 'Court 2', sportType: 'Tennis' },
        date: new Date('2024-12-20'),
        startTime: '16:00',
        endTime: '17:00',
        status: 'pending',
        totalAmount: 45
      }
    ]);
    setStats({
      totalBookings: 15,
      upcomingBookings: 3,
      completedBookings: 10,
      cancelledBookings: 2
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your bookings and track your activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <Clock className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <Activity className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedBookings}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <X className="h-10 w-10 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{stats.cancelledBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {booking.facility.name}
                    </h3>
                    <span className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="mr-4">{booking.facility.address.city}</span>
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="mr-4">{booking.date.toLocaleDateString()}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{booking.startTime} - {booking.endTime}</span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    {booking.court.name} • {booking.court.sportType}
                  </div>
                </div>
                <div className="ml-6 flex items-center">
                  <div className="text-right mr-4">
                    <div className="text-lg font-bold text-gray-900">
                      ${booking.totalAmount}
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};