import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-[#161616] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn 
          routing="path"
          path="/sign-in"
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
