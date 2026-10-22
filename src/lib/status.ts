export function getDescription(code: number): string {
    switch (code) {
        case 400:
            return 'クライアントエラーが発生しました';
        case 401:
            return '認証が必要です';
        case 403:
            return 'アクセスが拒否されました';
        case 404:
            return 'ページが存在しません';
        case 405:
            return '許可されていないメソッドです';
        case 422:
            return 'リクエストデータが不正です';
        case 429:
            return 'レートリミットされています';
        case 500:
            return '内部サーバーエラーです';
        case 502:
            return '不正なレスポンスを受信しました';
        case 503:
            return '一時的にご利用頂けません';
        case 504:
            return 'タイムアウトしました';
    }

    return '';
}
