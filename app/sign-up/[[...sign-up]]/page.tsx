import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-[#262626] border border-[#404040] shadow-2xl",
              headerTitle: "text-white",
              headerSubtitle: "text-[#a0a0a0]",
              socialButtonsBlockButton: "bg-[#1a1a1a] border-[#404040] text-white hover:bg-[#333]",
              socialButtonsBlockButtonText: "text-white",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              formFieldInput: "bg-[#1a1a1a] border-[#404040] text-white",
              formFieldLabel: "text-[#e0e0e0]",
              identityPreviewText: "text-[#a0a0a0]",
              formResendCodeLink: "text-blue-400",
              footerActionLink: "text-blue-400",
              dividerLine: "bg-[#404040]",
              dividerText: "text-[#a0a0a0]",
              alternativeMethodsBlockButton: "text-blue-400 hover:text-blue-300",
            }
          }}
          routing="path"
          path="/sign-up"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
