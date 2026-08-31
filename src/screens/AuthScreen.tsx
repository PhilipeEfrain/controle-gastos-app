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
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-4 py-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="max-w-md w-full self-center">
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

                {/* Botão de Envio */}
                <AppButton
                  label={
                    isLoading ? '' : isRegisterMode ? 'Cadastrar Minha Conta' : 'Acessar Meu Painel'
                  }
                  variant="primary"
                  onPress={handleSubmit}
                  disabled={isLoading}
                  className="mt-2"
                >
                  {isLoading && <ActivityIndicator color="#FFFFFF" size="small" />}
                </AppButton>
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
