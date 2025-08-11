"use client"

import { CheckCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Business } from "@/lib/db/schema/businesses"
import { Customer } from "@/lib/db/schema/customers"
import { FeedbackRequest } from "@/lib/db/schema/feedback-requests"
import { FeedbackTemplate } from "@/lib/db/schema/feedback-template"
import { TemplateQuestion } from "@/lib/db/schema/template-questions"

interface FeedbackFormProps {
  request: FeedbackRequest
  template: FeedbackTemplate
  questions: TemplateQuestion[]
  customer: Customer
  business: Business
}

interface Answer {
  questionId: string
  answer: string
}

export default function FeedbackForm({ request, template, questions, customer, business }: FeedbackFormProps) {
  console.log("FeedbackForm props", { request, template, questions, customer, business });
  const [answers, setAnswers] = useState<Answer[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, answer } : a))
      }
      return [...prev, { questionId, answer }]
    })
  }

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const existing = answers.find((a) => a.questionId === questionId)
    let currentAnswers = existing ? existing.answer.split(",").filter(Boolean) : []

    if (checked) {
      currentAnswers.push(option)
    } else {
      currentAnswers = currentAnswers.filter((a) => a !== option)
    }

    handleAnswerChange(questionId, currentAnswers.join(","))
  }

  const validateForm = () => {
    const requiredQuestions = questions.filter((q) => q.isRequired)
    const answeredQuestions = answers.map((a) => a.questionId)

    for (const question of requiredQuestions) {
      if (!answeredQuestions.includes(question.id)) {
        toast({
          title: "Missing Required Answer",
          description: `Please answer: ${question.questionText}`,
          variant: "destructive",
        })
        return false
      }
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setSubmitting(true)
    try {
      // Submit feedback response
      const responsePayload = {
        feedbackRequestId: request.id,
        customerId: customer.id,
        businessId: business.id,
        templateId: template.id,
        submittedAt: new Date().toISOString(),
        status: "completed",
      }

      const responseRes = await fetch("/api/feedback-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(responsePayload),
      })

      if (!responseRes.ok) throw new Error("Failed to submit response")

      const responseData = await responseRes.json()
      const feedbackResponseId = responseData.data.id

      // Submit answers
      const answersPayload = answers.map((answer) => ({
        feedbackResponseId,
        questionId: answer.questionId,
        answerText: answer.answer,
        submittedAt: new Date().toISOString(),
      }))

      const answersRes = await fetch("/api/question-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answersPayload }),
      })

      if (!answersRes.ok) throw new Error("Failed to submit answers")

      // Update request status
      await fetch(`/api/feedback-requests/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      })

      setSubmitted(true)
      toast({
        title: "Thank You!",
        description: "Your feedback has been submitted successfully.",
      })
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question: any) => {
    const currentAnswer = answers.find((a) => a.questionId === question.id)?.answer || ""

    switch (question.questionType) {
      case "input":
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
          />
        )

      case "textarea":
        return (
          <Textarea
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your detailed response..."
            className="w-full min-h-[100px]"
          />
        )

      case "radio":
        const radioOptions = question.options ? question.options.split(",") : []
        return (
          <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswerChange(question.id, value)}>
            {radioOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option.trim()} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`}>{option.trim()}</Label>
              </div>
            ))}
          </RadioGroup>
        )

      case "checkbox":
        const checkboxOptions = question.options ? question.options.split(",") : []
        const selectedOptions = currentAnswer ? currentAnswer.split(",") : []
        return (
          <div className="space-y-2">
            {checkboxOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${index}`}
                  checked={selectedOptions.includes(option.trim())}
                  onCheckedChange={(checked) => handleCheckboxChange(question.id, option.trim(), checked as boolean)}
                />
                <Label htmlFor={`${question.id}-${index}`}>{option.trim()}</Label>
              </div>
            ))}
          </div>
        )

      default:
        return (
          <Input
            value={currentAnswer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="w-full"
          />
        )
    }
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600 mb-6">
              Your feedback has been submitted successfully. We appreciate you taking the time to share your experience
              with us.
            </p>
            <p className="text-sm text-gray-500">You can now close this window.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            {template.companyLogo ? (
              <img src={template.companyLogo || "/placeholder.svg"} alt={business.name} className="h-16 w-auto" />
            ) : (
              <div className="h-16 w-16 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {business.name.charAt(0)}
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">{template.name}</CardTitle>
          <CardDescription className="text-lg">
            Hello {customer.customerName}, {template.companyStatement}
          </CardDescription>
          {template.companyStatement && (
            <p className="text-sm text-muted-foreground mt-4 italic">"{template.companyStatement}"</p>
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {questions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <Label className="text-base font-medium">
                    {question.questionText}
                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {<p className="text-sm text-muted-foreground mt-1">In case of any questions/concerns kindly reach out to the business support team</p>}
                </div>
              </div>
              <div className="ml-10">{renderQuestion(question)}</div>
            </div>
          ))}

          <div className="flex justify-center pt-8">
            <Button onClick={handleSubmit} disabled={submitting} size="lg" className="px-8">
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
