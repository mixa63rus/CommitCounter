import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Chart({ data }) {
    return (
        <div className="graf">
            <ResponsiveContainer minHeight={200} minWidth={350} width="90%" height="50%">
                <BarChart width={600} height={400} data={data} >
                    <CartesianGrid />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="github" stackId="a" fill="red" />
                    <Bar dataKey="bitbucket" stackId="a" fill="blue" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart;
