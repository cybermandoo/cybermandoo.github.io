(function () {
    console.log('[검색 스크립트] 시작');

    // --- DOM 요소 선택 ---
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    const mobileHeader = document.getElementById('mobile-header');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchResults = document.getElementById('mobileSearchResults');
    const mobileSearchIcon = document.querySelector('.mobile-search-icon');

    let fuse;
    let searchData = [];

    // --- 함수 정의 ---
    function loadSearchData() {
        console.log('[검색 스크립트] index.json 데이터 로드를 시도합니다...');
        fetch('/index.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`[오류] index.json 로드 실패! 상태 코드: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('[검색 스크립트] index.json 데이터 로드 성공!', data);
                searchData = data;
                if (searchData.length === 0) {
                    console.warn('[경고] 검색 데이터가 비어있습니다. content 폴더에 게시물이 있는지 확인하세요.');
                }

                const options = {
                    keys: ['title', 'summary', 'tags', 'categories'],
                    includeMatches: true,
                    minMatchCharLength: 2,
                    threshold: 0.4,
                };
                fuse = new Fuse(searchData, options);
                console.log('[검색 스크립트] Fuse.js 초기화 완료.');
            })
            .catch(error => {
                console.error(error);
            });
    }

    function executeSearch(event) {
        const query = event.target.value.trim();
        const isMobile = event.target.id === 'mobileSearchInput';
        
        if (!fuse) {
            console.error('[오류] Fuse.js가 초기화되지 않았습니다.');
            return;
        }

        if (query.length < 2) {
            clearResults(isMobile);
            return;
        }

        const results = fuse.search(query);
        displayResults(results, isMobile);
    }

    function displayResults(results, isMobile) {
        clearResults(isMobile);

        const targetResultsEl = isMobile ? mobileSearchResults : searchResults;
        if (!targetResultsEl) return;

        if (results.length > 0) {
            const resultItems = results.slice(0, 10).map(result => {
                const item = result.item;
                return `
                    <li class="search-result-item">
                        <a href="${item.permalink}">
                            <div class="search-result-title">${item.title}</div>
                            <div class="search-result-summary">${item.summary || ''}</div>
                        </a>
                    </li>
                `;
            }).join('');
            targetResultsEl.innerHTML = resultItems;
            if (isMobile) {
                targetResultsEl.classList.add('is-visible');
            }
        }
    }

    function clearResults(isMobile) {
        if (isMobile) {
            if (mobileSearchResults) {
                mobileSearchResults.innerHTML = '';
                mobileSearchResults.classList.remove('is-visible');
            }
        } else {
            if (searchResults) searchResults.innerHTML = '';
        }
    }

    function toggleMobileSearch() {
        if (!mobileHeader) return;
        
        mobileHeader.classList.toggle('is-searching');

        if (mobileHeader.classList.contains('is-searching')) {
            mobileSearchInput.focus(); // 검색 모드가 되면 입력창에 포커스
        } else {
            // 검색 모드가 해제되면 모바일 검색 결과도 숨김
            clearResults(true);
        }
    }

    // --- 이벤트 리스너 설정 ---
    document.addEventListener('DOMContentLoaded', () => {
        loadSearchData();

        if (searchInput) searchInput.addEventListener('input', executeSearch);
        if (mobileSearchInput) mobileSearchInput.addEventListener('input', executeSearch);
        if (mobileSearchIcon) mobileSearchIcon.addEventListener('click', toggleMobileSearch);
    });

})();