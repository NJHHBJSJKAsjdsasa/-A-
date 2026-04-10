export const errorMessages = {
  zh: {
    MISSING_FIELDS: '邮箱、密码和昵称不能为空',
    INVALID_EMAIL: '邮箱格式不正确',
    WEAK_PASSWORD: '密码长度至少为8个字符',
    INVALID_NICKNAME: '昵称长度必须在2-50个字符之间',
    INVALID_LANGUAGE: '无效的语言代码',
    EMAIL_EXISTS: '该邮箱已被注册',
    INTERNAL_ERROR: '注册失败，请稍后重试',
    INVALID_CREDENTIALS: '邮箱或密码错误',
    LOGIN_FAILED: '登录失败',
    USER_NOT_FOUND: '用户不存在',
    FORBIDDEN: '无权操作',
    INVALID_PASSWORD: '当前密码不正确',
    PASSWORD_CHANGE_FAILED: '修改密码失败',
    ACCOUNT_DELETE_FAILED: '注销账户失败'
  },
  en: {
    MISSING_FIELDS: 'Email, password and nickname are required',
    INVALID_EMAIL: 'Invalid email format',
    WEAK_PASSWORD: 'Password must be at least 8 characters long',
    INVALID_NICKNAME: 'Nickname must be between 2 and 50 characters',
    INVALID_LANGUAGE: 'Invalid language code',
    EMAIL_EXISTS: 'Email already registered',
    INTERNAL_ERROR: 'Registration failed, please try again later',
    INVALID_CREDENTIALS: 'Invalid email or password',
    LOGIN_FAILED: 'Login failed',
    USER_NOT_FOUND: 'User not found',
    FORBIDDEN: 'Forbidden',
    INVALID_PASSWORD: 'Current password is incorrect',
    PASSWORD_CHANGE_FAILED: 'Failed to change password',
    ACCOUNT_DELETE_FAILED: 'Failed to delete account'
  },
  ja: {
    MISSING_FIELDS: 'メールアドレス、パスワード、ニックネームは必須です',
    INVALID_EMAIL: 'メールアドレスの形式が正しくありません',
    WEAK_PASSWORD: 'パスワードは8文字以上である必要があります',
    INVALID_NICKNAME: 'ニックネームは2〜50文字である必要があります',
    INVALID_LANGUAGE: '無効な言語コード',
    EMAIL_EXISTS: 'このメールアドレスは既に登録されています',
    INTERNAL_ERROR: '登録に失敗しました。後でもう一度お試しください',
    INVALID_CREDENTIALS: 'メールアドレスまたはパスワードが正しくありません',
    LOGIN_FAILED: 'ログインに失敗しました',
    USER_NOT_FOUND: 'ユーザーが見つかりません',
    FORBIDDEN: '権限がありません',
    INVALID_PASSWORD: '現在のパスワードが正しくありません',
    PASSWORD_CHANGE_FAILED: 'パスワードの変更に失敗しました',
    ACCOUNT_DELETE_FAILED: 'アカウントの削除に失敗しました'
  },
  ko: {
    MISSING_FIELDS: '이메일, 비밀번호, 닉네임은 필수입니다',
    INVALID_EMAIL: '이메일 형식이 올바르지 않습니다',
    WEAK_PASSWORD: '비밀번호는 8자 이상이어야 합니다',
    INVALID_NICKNAME: '닉네임은 2-50자 사이여야 합니다',
    INVALID_LANGUAGE: '잘못된 언어 코드',
    EMAIL_EXISTS: '이미 등록된 이메일입니다',
    INTERNAL_ERROR: '등록에 실패했습니다. 나중에 다시 시도해주세요',
    INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    LOGIN_FAILED: '로그인에 실패했습니다',
    USER_NOT_FOUND: '사용자를 찾을 수 없습니다',
    FORBIDDEN: '권한이 없습니다',
    INVALID_PASSWORD: '현재 비밀번호가 올바르지 않습니다',
    PASSWORD_CHANGE_FAILED: '비밀번호 변경에 실패했습니다',
    ACCOUNT_DELETE_FAILED: '계정 삭제에 실패했습니다'
  }
};

export const getErrorMessage = (code: string, language: string = 'zh'): string => {
  const lang = language as keyof typeof errorMessages;
  return errorMessages[lang]?.[code as keyof typeof errorMessages['zh']] || errorMessages['en'][code as keyof typeof errorMessages['en']] || code;
};
