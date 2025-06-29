(function() {
    // 즉시 실행 함수로 변수 충돌 방지

    // 필요한 DOM 요소들 선택
    const themeToggler = document.querySelector('.dark-mode-toggle');
    const body = document.body;

    // 테마 적용 함수
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
    };

    // 페이지 로드 시 실행될 로직
    document.addEventListener('DOMContentLoaded', () => {
        // 이전에 저장된 테마가 있는지 확인, 없으면 'light'를 기본값으로
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        // 토글 버튼이 존재하는지 확인 후 이벤트 리스너 추가
        if (themeToggler) {
            themeToggler.addEventListener('click', () => {
                // 현재 테마 확인 후 반대 테마로 전환
                const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

                // 새 테마 적용 및 localStorage에 저장
                applyTheme(newTheme);
                localStorage.setItem('theme', newTheme);
            });
        }
    });

})();