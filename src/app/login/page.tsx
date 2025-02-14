import { LoginForm } from "@/components/login-form"
import Template from "@/components/template-custom"

export default function Page() {
  return (
    <Template>
      <div className="h-full flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </Template>
  )
}
