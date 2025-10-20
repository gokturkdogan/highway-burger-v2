export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-[#bb7c05] mb-6">
          Giriş Yap
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bb7c05]"
              placeholder="Email adresinizi girin"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifre
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bb7c05]"
              placeholder="Şifrenizi girin"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#bb7c05] to-[#d49624] text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-shadow"
          >
            Giriş Yap
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Hesabınız yok mu?{' '}
          <a href="/auth/register" className="text-[#bb7c05] font-medium">
            Kayıt olun
          </a>
        </p>
      </div>
    </div>
  )
}