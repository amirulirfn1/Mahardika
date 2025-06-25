import AuthForm from '@/components/AuthForm';

export default function SignInPage() {
  return (
    <div className="container py-5">
      <AuthForm
        onLogin={async (email, password) => {
          // TODO: Implement login logic with Supabase
          alert(`Login: ${email}`);
        }}
        className="mx-auto"
      />
    </div>
  );
}
