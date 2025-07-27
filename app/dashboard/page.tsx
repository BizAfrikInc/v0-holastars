import React from "react"
import DashboardOverview from "@/components/dashboard/DashboardOverview"
import CustomSuspenseBoundary from "@/components/utils/CustomSuspenseBoundary"
const Dashboard = ()=>(
  <CustomSuspenseBoundary>
    <div className="flex-1 p-6">
      <DashboardOverview />
    </div>
  </CustomSuspenseBoundary>
)

export default Dashboard