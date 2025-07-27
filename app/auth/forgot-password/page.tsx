import ForgotPassword from "@/components/auth/ForgotPassword"
import CustomSuspenseBoundary from "@/components/utils/CustomSuspenseBoundary"


const Index = () => {
  return (
    <CustomSuspenseBoundary>
      <ForgotPassword/>
    </CustomSuspenseBoundary>
  )
}

export default Index;
