import { LoginForm } from "@/components/login-form"
import Template from "@/components/template-custom"

export default function Page() {
  return (
    <Template>
      <div className="h-[calc(100%-1.4rem)] flex justify-center items-center px-4 pt-4 pb-16">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      {/* <div className="h-full flex justify-center items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div> */}
    </Template>
  )
}
