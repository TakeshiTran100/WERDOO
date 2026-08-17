import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';

const Auth = () => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError('Sai email hoặc mật khẩu. Thử lại nhé.');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message === 'User already registered'
          ? 'Email này đã có tài khoản rồi, hãy đăng nhập.'
          : 'Có lỗi khi đăng ký: ' + error.message);
      } else {
        setInfo('Đăng ký thành công! Bạn có thể đăng nhập ngay.');
        setMode('login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400">
            ✨ WERDOO
          </div>
          <p className="text-purple-200 text-sm mt-2">Không gian sáng tác riêng của bạn</p>
        </div>

        <div className="flex mb-6 bg-white/10 rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'login' ? 'bg-purple-500 text-white' : 'text-purple-200'}`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(''); setInfo(''); }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${mode === 'signup' ? 'bg-purple-500 text-white' : 'text-purple-200'}`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="ban@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-purple-200 mb-1">Mật khẩu</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Ít nhất 6 ký tự"
            />
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}
          {info && <p className="text-green-300 text-sm">{info}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg disabled:opacity-50"
          >
            {loading ? 'Đang xử lý...' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Auth;