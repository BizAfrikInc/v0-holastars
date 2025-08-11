"use client"
import React, { use, useEffect, useState } from "react"
import FeedbackForm from "@/components/feedback/FeedbackForm"
import CustomAlert from "@/components/ui/CustomAlert"
import LoadingSpinner from "@/components/ui/LoaderSpinner"
import { toast } from "@/hooks/use-toast"
import { CustomersApi } from "@/lib/api/customer"
import { FeedbackRequestApi } from "@/lib/api/feedback-request"
import { Business } from "@/lib/db/schema/businesses"
import { Customer } from "@/lib/db/schema/customers"
import { FeedbackRequest } from "@/lib/db/schema/feedback-requests"
import { FeedbackTemplate } from "@/lib/db/schema/feedback-template"
import { TemplateQuestion } from "@/lib/db/schema/template-questions"

interface PageProps {
    params: Promise<{
        requestId: string
        customerId: string
    }>
}

export default function FeedbackPageClient({ params }: PageProps) {
    const { requestId, customerId } = use(params)

    const [feedbackRequest, setFeedbackRequest] = useState<FeedbackRequest | null>(null)
    const [template, setTemplate] = useState<FeedbackTemplate | null>(null)
    const [questions, setQuestions] = useState<TemplateQuestion[] | null>(null)
    const [customer, setCustomer] = useState<Customer | null>(null)
    const [business, setBusiness] = useState<Business | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCustomer = async () => {
        try {
            const { data: response } = await CustomersApi.fetchById(customerId)
            if (!response.success) {
                toast({
                    title: "Info",
                    description: "No customers found",
                });
                return;
            }
            setCustomer(response.data)
        } catch {
            toast({
                title: "Error",
                description: " Something went wrong, try again later ",
                variant: "destructive"
            })
        }
    }

    const fetchFeedbackRequest = async () => {
        try {
            const { data: response } = await FeedbackRequestApi.fetchFeedbackRequestDetails(requestId)
            if (!response.success) {
                toast({
                    title: "Info",
                    description: "No feedback request found",
                });
                return;
            }
            const { feedbackRequest, feedbackTemplate, templateQuestions, business } = response.data
            setFeedbackRequest(feedbackRequest)
            setTemplate(feedbackTemplate)
            setQuestions(templateQuestions)
            setBusiness(business)
        } catch {
            toast({
                title: "Error",
                description: " Something went wrong, try again later ",
                variant: "destructive"
            })
        }
    }

    useEffect(() => {
        setIsLoading(true)
        Promise.all([fetchFeedbackRequest(), fetchCustomer()]).finally(() => setIsLoading(false))
    }, [requestId])

    if (isLoading) {
        return (<LoadingSpinner />
        )
    }

    // if (feedbackRequest?.status !== "sent" && feedbackRequest?.status !== "pending") {
    //     return (
    //         <div className="flex items-center justify-center bg-gray-50">
    //             <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8 text-center">
    //                 <CustomAlert
    //                     variant="warning"
    //                     title="Feedback Request Expired"
    //                     closable={false}
    //                 >
    //                     This feedback request is no longer active. Please contact the business directly if you need assistance.
    //                 </CustomAlert>
    //             </div>
    //         </div>
    //     )
    // }




    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {feedbackRequest && template && questions && customer && business && (
                    <FeedbackForm
                        request={feedbackRequest}
                        template={template}
                        questions={questions}
                        customer={customer}
                        business={business}
                    />
                )}
            </div>
        </div>
    )
}