import { RegisterForm } from "@/components/register-form"
import Template from "@/components/template-custom"

export default function Register() {
  return (
    <Template>
      <div className="h-full flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
    </Template>
  )
}
