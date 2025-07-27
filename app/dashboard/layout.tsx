"use client"
import React from "react"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"


export default function DashboardLayout({ children}: { children: React.ReactNode }) {

  return (

          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex">
              <DashboardSidebar />
                {children}
            </div>
          </div>

  );}