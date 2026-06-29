import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TopNavbar from "../Components/TopNavbar";
import SalesChart from "../lib/Salesgraph";
import FormattedTime from "../lib/FormattedTime ";

import { gettingallSales } from "../features/salesSlice";
import { getrecentActivityLogs } from "../features/activitySlice";

import { LuUsers, LuShoppingCart, LuClock, LuActivity } from "react-icons/lu";

function Dashboardpage() {
  const dispatch = useDispatch();

  const { getallsales } = useSelector((state) => state.sales);

  const { staffuser, manageruser, adminuser } = useSelector(
    (state) => state.auth,
  );

  const { recentuser } = useSelector((state) => state.activity);

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    dispatch(gettingallSales());

    dispatch(getrecentActivityLogs());
  }, []);

  const filteredSales = useMemo(() => {
    if (!startDate || !endDate) return getallsales || [];

    return getallsales?.filter((sale) => {
      const date = new Date(sale.createdAt);

      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }, [getallsales, startDate, endDate]);

  const today = new Date();

  const todayRevenue = getallsales
    ?.filter((sale) => {
      const d = new Date(sale.createdAt);

      return d.toDateString() === today.toDateString();
    })

    .reduce(
      (sum, sale) => sum + sale.totalAmount,

      0,
    );

  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayRevenue = getallsales
    ?.filter((sale) => {
      const d = new Date(sale.createdAt);

      return d.toDateString() === yesterday.toDateString();
    })

    .reduce(
      (sum, sale) => sum + sale.totalAmount,

      0,
    );

  const weeklyRevenue = getallsales
    ?.filter((sale) => {
      const d = new Date(sale.createdAt);

      return today - d < 7 * 24 * 60 * 60 * 1000;
    })

    .reduce(
      (sum, sale) => sum + sale.totalAmount,

      0,
    );

  const monthlyRevenue = getallsales
    ?.filter((sale) => {
      const d = new Date(sale.createdAt);

      return (
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    })

    .reduce(
      (sum, sale) => sum + sale.totalAmount,

      0,
    );

  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.totalAmount,

    0,
  );

  const pendingOrders = filteredSales.filter(
    (sale) => sale.status === "pending",
  ).length;

  const completedOrders = filteredSales.filter(
    (sale) => sale.status === "completed",
  ).length;

  const totalOrders = filteredSales.length;

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNavbar />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          <Card title="Today's Sales" value={`${todayRevenue}`} icon={"Rs."} />

          <Card title="Yesterday" value={`${yesterdayRevenue}`} icon={"Rs."} />

          <Card title="Weekly" value={`${weeklyRevenue}`} icon={"Rs."} />

          <Card title="Monthly" value={`${monthlyRevenue}`} icon={"Rs."} />

          <Card title="Orders" value={totalOrders} icon={<LuShoppingCart />} />

          <Card title="Pending" value={pendingOrders} icon={<LuClock />} />

          <Card
            title="Completed"
            value={completedOrders}
            icon={<LuShoppingCart />}
          />

          <Card title="Revenue" value={`${totalRevenue}`} icon={"Rs."} />

          {/* <Card title="Staff" value={staffuser?.length} icon={<LuUsers />} />

          <Card
            title="Managers"
            value={manageruser?.length}
            icon={<LuUsers />}
          />

          <Card title="Admins" value={adminuser?.length} icon={<LuUsers />} /> */}
        </div>

        <div className="bg-white rounded-xl shadow p-5 mt-10">
          <h2 className="font-semibold text-xl mb-4">Date Filter</h2>

          <div className="flex gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg p-2"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg p-2"
            />
          </div>
        </div>

        <div className="mt-10">
          <SalesChart />
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-10">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold text-xl mb-5">Recent Sales</h2>

            {filteredSales

              .slice()

              .reverse()

              .slice(0, 5)

              .map((sale) => (
                <div key={sale._id} className="border-b py-3">
                  <p className="font-semibold">{sale.customerName}</p>

                  <p>Rs.{sale.totalAmount}</p>

                  <p className="text-sm text-gray-500">
                    <FormattedTime timestamp={sale.createdAt} />
                  </p>
                </div>
              ))}
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-bold text-xl mb-5">Recent Activity</h2>

            {recentuser
              ?.slice(0, 5)

              .map((log) => (
                <div key={log._id} className="border-b py-3">
                  <div className="flex items-center gap-3">
                    <LuActivity />

                    <div>
                      <p>{log.userId?.name}</p>

                      <p className="text-sm text-gray-500">{log.action}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboardpage;

function Card({
  title,

  value,

  icon,
}) {
  return (
    <div className="bg-white rounded-xl p-5 shadow hover:shadow-xl transition">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-gray-500">{title}</p>

          <h2 className="text-3xl font-bold">{value}</h2>
        </div>

        <div className="text-blue-600 text-4xl">{icon}</div>
      </div>
    </div>
  );
}
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import Gettopproduct from "../lib/Gettopproduct";
// import TopNavbar from "../Components/TopNavbar";
// import { LuUsers, LuClock, LuActivity } from "react-icons/lu"; // Icons for activity logs
// import { getrecentActivityLogs } from "../features/activitySlice";
// import FormattedTime from "../lib/FormattedTime ";
// import { io } from "socket.io-client";

// function Dashboardpage() {
//   const { staffuser, manageruser, adminuser } = useSelector(
//     (state) => state.auth,
//   );
//   const { recentuser } = useSelector((state) => state.activity);
//   const dispatch = useDispatch();

//   const socket = io("http://localhost:5000", {
//     withCredentials: true,
//     transports: ["websocket", "polling"],
//   });

//   useEffect(() => {
//     dispatch(getrecentActivityLogs());

//     // Listen for new activity logs
//     socket.on("newActivityLog", (newLog) => {
//       console.log("New activity log:", newLog);
//       // Optionally, update the UI or refetch logs
//     });

//     return () => {
//       socket.off("newActivityLog"); // Clean up the listener
//     };
//   }, [dispatch, socket]);

//   return (
//     <div className="bg-base-100">
//       <TopNavbar />
//       <div className="min-h-screen flex flex-col items-center p-10">
//         <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

//         {/* User Count Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-56 h-56 hover:shadow-xl transition-shadow">
//             <LuUsers className="text-5xl text-blue-500 mb-4" />
//             <p className="text-xl font-bold text-gray-700">
//               {staffuser?.length || 0}
//             </p>
//             <p className="text-gray-500">Staff Users</p>
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-56 h-56 hover:shadow-xl transition-shadow">
//             <LuUsers className="text-5xl text-green-500 mb-4" />
//             <p className="text-xl font-bold text-gray-700">
//               {manageruser?.length || 0}
//             </p>
//             <p className="text-gray-500">Managers</p>
//           </div>

//           <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col items-center w-56 h-56 hover:shadow-xl transition-shadow">
//             <LuUsers className="text-5xl text-red-500 mb-4" />
//             <p className="text-xl font-bold text-gray-700">
//               {adminuser?.length || 0}
//             </p>
//             <p className="text-gray-500">Admins</p>
//           </div>
//         </div>

//         {/* Top Products Section */}
//         <Gettopproduct className="mt-20" />
//       </div>

//       {/* Recent Activity Section */}
//       <div className="mt-10 p-10 bg-gray-50">
//         <h1 className="text-2xl font-bold mb-6">Recent Activity</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {recentuser?.length > 0 ? (
//             recentuser.map((logs) => (
//               <div
//                 key={logs._id}
//                 className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
//               >
//                 <div className="flex items-center space-x-4 mb-4">
//                   <div className="p-3 bg-blue-100 rounded-full">
//                     <LuActivity className="text-blue-500 text-2xl" />
//                   </div>
//                   <div>
//                     <h2 className="text-lg font-semibold">
//                       {logs.userId.name || "Unknown User"}
//                     </h2>
//                     <p className="text-sm text-gray-500">{logs.action}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 text-sm text-gray-600">
//                   <LuClock className="text-gray-500" />
//                   <FormattedTime timestamp={logs.createdAt} />
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No recent activity logs found.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboardpage;
