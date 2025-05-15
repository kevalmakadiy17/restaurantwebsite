import React from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react';

export const Analytics = ({ orders }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.timestamp);
    return orderDate >= today;
  });

  const totalRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const averageOrderValue = todayOrders.length > 0 
    ? totalRevenue / todayOrders.length 
    : 0;

  const completedOrders = todayOrders.filter(order => order.status === 'completed');
  const averagePreparationTime = completedOrders.length > 0
    ? completedOrders.reduce((sum, order) => {
        const start = new Date(order.timestamp);
        const end = new Date(order.timestamp);
        return sum + (end.getTime() - start.getTime());
      }, 0) / completedOrders.length / 1000 / 60
    : 0;

  const stats = [
    {
      title: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: "Today's Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Average Order Value',
      value: `$${averageOrderValue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Avg Preparation Time',
      value: `${Math.round(averagePreparationTime)} min`,
      icon: Clock,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Items</h3>
          <div className="space-y-4">
            {Array.from(
              orders.reduce((acc, order) => {
                order.items.forEach(item => {
                  const current = acc.get(item.menuItem.id) || { 
                    name: item.menuItem.name, 
                    quantity: 0 
                  };
                  acc.set(item.menuItem.id, {
                    name: item.menuItem.name,
                    quantity: current.quantity + item.quantity
                  });
                });
                return acc;
              }, new Map())
            )
              .sort(([, a], [, b]) => b.quantity - a.quantity)
              .slice(0, 5)
              .map(([id, { name, quantity }]) => (
                <div key={id} className="flex justify-between items-center">
                  <span className="text-gray-600">{name}</span>
                  <span className="font-semibold">{quantity} orders</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Order Status Distribution</h3>
          <div className="space-y-4">
            {['pending', 'preparing', 'ready', 'completed'].map(status => {
              const count = orders.filter(order => order.status === status).length;
              const percentage = orders.length > 0 
                ? (count / orders.length * 100).toFixed(1) 
                : 0;
              
              return (
                <div key={status} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{status}</span>
                    <span>{count} orders ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        status === 'completed' ? 'bg-green-500' :
                        status === 'ready' ? 'bg-blue-500' :
                        status === 'preparing' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};