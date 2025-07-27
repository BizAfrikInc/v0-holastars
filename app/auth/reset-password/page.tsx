import ResetPassword from "@/components/auth/ResetPassword"
import CustomSuspenseBoundary from "@/components/utils/CustomSuspenseBoundary"


const Index = () => {
  return (
    <CustomSuspenseBoundary>
      <ResetPassword/>
    </CustomSuspenseBoundary>
  )
}

export default Index;
