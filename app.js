// app.js - carrinho usando localStorage, incrementa quantidade se já existir
document.addEventListener('DOMContentLoaded', () => {
    const adicionarBtns = document.querySelectorAll('.adicionar');
    const carrinhoBtn = document.getElementById('btn-carrinho');

    function carregarCart() {
        const raw = localStorage.getItem('dourattoCart');
        if (!raw) return [];
        try { return JSON.parse(raw); } catch(e) { return []; }
    }
    function salvarCart(cart) { localStorage.setItem('dourattoCart', JSON.stringify(cart)); }

    function adicionarProduto(produto, preco, btnEl) {
        const cart = carregarCart();
        const found = cart.find(i => i.produto === produto);
        if (found) {
            found.qtd = (found.qtd || 1) + 1;
        } else {
            cart.push({ produto, preco: parseFloat(preco), qtd: 1 });
        }
        salvarCart(cart);

        // animação e feedback
        if (btnEl) {
            btnEl.classList.add('adicionado');
            const old = btnEl.textContent;
            btnEl.textContent = 'Adicionado ✓';
            setTimeout(() => {
                btnEl.classList.remove('adicionado');
                btnEl.textContent = old;
            }, 700);
        }
    }

    adicionarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const produto = btn.getAttribute('data-produto');
            const preco = btn.getAttribute('data-preco');
            adicionarProduto(produto, preco, btn);
        });
    });

    // Ao clicar no carrinho, vai para checkout.html
    if (carrinhoBtn) {
        carrinhoBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }
});