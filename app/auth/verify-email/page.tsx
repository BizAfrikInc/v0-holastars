import EmailVerification from "@/components/auth/EmailVerification"
import CustomSuspenseBoundary from "@/components/utils/CustomSuspenseBoundary"


const Index = () => {
  return (
    <CustomSuspenseBoundary>
      <EmailVerification/>
    </CustomSuspenseBoundary>
  )
}

export default Index;
