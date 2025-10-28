export default function AuthError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Erro de autenticação</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Credenciais inválidas. Por favor tente novamente.</p>
          <div className="mt-4 text-center">
            <a href="/auth/signin" className="text-blue-600 hover:text-blue-500">Voltar para login</a>
          </div>
        </div>
      </div>
    </div>
  )
}
