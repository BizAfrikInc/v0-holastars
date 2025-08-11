import CustomSuspenseBoundary from "@/components/utils/CustomSuspenseBoundary";
import FeedbackPageClient from ".";
interface PageProps {
  params: Promise<{
    requestId: string
    customerId: string
  }>
}

const Index = ({ params }: PageProps) => {
  return (
    <CustomSuspenseBoundary>
      <FeedbackPageClient params={params} />
    </CustomSuspenseBoundary>
  )
}

export default Index;