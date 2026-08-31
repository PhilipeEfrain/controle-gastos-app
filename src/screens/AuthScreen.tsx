import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { AppCard } from '../components/ui/AppCard';
import { AppButton } from '../components/ui/AppButton';
import { useAuth } from '../hooks/useAuth';

export const AuthScreen: React.FC = () => {
  const { login, register, loginGoogle } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (isRegisterMode) {
      if (!name.trim()) {
        setErrorMessage('Por favor, informe o seu nome.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('As senhas digitadas não coincidem.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isRegisterMode) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao realizar autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMessage(null);
    setIsGoogleLoading(true);
    try {
      await loginGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Falha ao autenticar com o Google.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 w-full bg-slate-950" style={{ flex: 1, width: '100%' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 w-full"
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          className="flex-1 w-full"
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{
            flexGrow: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 32,
            paddingHorizontal: 16,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="max-w-md w-full" style={{ width: '100%', maxWidth: 448 }}>
            {/* Header / Logo */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-emerald-600/20 border border-emerald-500/30 rounded-2xl items-center justify-center mb-3 shadow-lg shadow-emerald-900/40">
                <Text className="text-emerald-400 text-3xl font-extrabold">💰</Text>
              </View>
              <Text className="text-white text-2xl font-bold tracking-tight">
                Controle Quinzenal
              </Text>
              <Text className="text-slate-400 text-sm mt-1 text-center">
                Gestão simplificada do seu orçamento do Dia 31 e Dia 15
              </Text>
            </View>

            {/* Card Principal */}
            <AppCard className="bg-slate-900 border-slate-800 shadow-2xl">
              {/* Abas Alternáveis */}
              <View className="flex-row bg-slate-950/80 p-1.5 rounded-xl mb-6 border border-slate-800">
                <Pressable
                  onPress={() => {
                    setIsRegisterMode(false);
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg items-center cursor-pointer transition-all ${
                    !isRegisterMode ? 'bg-slate-800 shadow-sm' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      !isRegisterMode ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    Entrar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsRegisterMode(true);
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-lg items-center cursor-pointer transition-all ${
                    isRegisterMode ? 'bg-slate-800 shadow-sm' : 'hover:bg-slate-900/50'
                  }`}
                >
                  <Text
                    className={`font-semibold text-sm ${
                      isRegisterMode ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    Criar Conta
                  </Text>
                </Pressable>
              </View>

              {/* Mensagem de Erro */}
              {errorMessage && (
                <View className="bg-red-950/70 border border-red-800/80 rounded-xl p-3.5 mb-5 flex-row items-center">
                  <Text className="text-red-400 text-sm flex-1 leading-tight font-medium">
                    ⚠️ {errorMessage}
                  </Text>
                </View>
              )}

              {/* Formulário */}
              <View className="space-y-4">
                {isRegisterMode && (
                  <View className="mb-4">
                    <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                      Nome Completo
                    </Text>
                    <TextInput
                      placeholder="Ex: João da Silva"
                      placeholderTextColor="#64748B"
                      value={name}
                      onChangeText={setName}
                      autoCapitalize="words"
                      className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-base"
                    />
                  </View>
                )}

                <View className="mb-4">
                  <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                    E-mail
                  </Text>
                  <TextInput
                    placeholder="seu.email@exemplo.com"
                    placeholderTextColor="#64748B"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-base"
                  />
                </View>

                <View className="mb-4">
                  <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                    Senha
                  </Text>
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="#64748B"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-base"
                  />
                </View>

                {isRegisterMode && (
                  <View className="mb-5">
                    <Text className="text-slate-300 text-xs font-semibold uppercase mb-1.5 ml-1">
                      Confirmar Senha
                    </Text>
                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#64748B"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry
                      autoCapitalize="none"
                      className="bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 text-base"
                    />
                  </View>
                )}

                {/* Botão de Envio com Email/Senha */}
                <AppButton
                  label={
                    isLoading ? '' : isRegisterMode ? 'Cadastrar Minha Conta' : 'Acessar Meu Painel'
                  }
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={isLoading || isGoogleLoading}
                  className="mt-2"
                >
                  {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
                </AppButton>

                {/* Divisor Visual */}
                <View className="flex-row items-center my-4">
                  <View className="flex-1 h-[1px] bg-slate-800" />
                  <Text className="text-slate-500 text-xs font-semibold px-3 uppercase tracking-wider">
                    ou
                  </Text>
                  <View className="flex-1 h-[1px] bg-slate-800" />
                </View>

                {/* Botão Google Sign-In */}
                <Pressable
                  onPress={handleGoogleAuth}
                  disabled={isLoading || isGoogleLoading}
                  className="flex-row items-center justify-center bg-slate-950 hover:bg-slate-800/90 active:bg-slate-800 border border-slate-700/90 py-3 px-4 rounded-xl cursor-pointer transition-all active:scale-[0.98] shadow-sm"
                >
                  {isGoogleLoading ? (
                    <ActivityIndicator color="#10B981" size="small" />
                  ) : (
                    <>
                      {/* Ícone estilizado do Google */}
                      <View className="w-5 h-5 rounded-full bg-white items-center justify-center mr-3 shadow-xs">
                        <Text className="text-[13px] font-bold text-slate-900 leading-none">
                          G
                        </Text>
                      </View>
                      <Text className="text-slate-100 font-semibold text-base">
                        {isRegisterMode ? 'Cadastrar com o Google' : 'Continuar com o Google'}
                      </Text>
                    </>
                  )}
                </Pressable>
              </View>
            </AppCard>

            {/* Rodapé */}
            <Text className="text-slate-500 text-xs text-center mt-6">
              Ambiente seguro protegido por Firebase Auth & Firestore Rules
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
