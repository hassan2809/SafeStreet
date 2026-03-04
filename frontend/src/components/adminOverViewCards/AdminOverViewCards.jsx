import React from "react";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

const AdminOverViewCards = ({ title, metric = { daily: 0, weekly: 0, monthly: 0 }, changes = { value: 0, positive: true }, icon }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold">{metric?.monthly?.toLocaleString?.() || 0}</h3>

                    <div className={`flex items-center mt-2 ${changes.positive ? 'text-green-500' : 'text-red-500'}`}>
                        {changes.positive ? (
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        <span className="text-sm font-medium">{changes.value}% from last month</span>
                    </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">

                    {icon}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Daily</p>
                    <p className="font-semibold">{metric?.daily || 0}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Weekly</p>
                    <p className="font-semibold">{metric?.weekly || 0}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500">Monthly</p>
                    <p className="font-semibold">{metric?.monthly || 0}</p>
                </div>
            </div>
        </div>
    );
};


export default AdminOverViewCards;