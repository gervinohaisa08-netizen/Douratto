// checkout.js
document.addEventListener('DOMContentLoaded', () => {
    const listaEl = document.getElementById('lista-itens');
    const subtotalEl = document.getElementById('subtotal');
    const taxaEl = document.getElementById('taxa-entrega');
    const totalGeralEl = document.getElementById('total-geral');
    const finalizarBtn = document.getElementById('finalizar');
    const cancelarBtn = document.getElementById('cancelar');

    const nomeInput = document.getElementById('nome-c');
    const telInput = document.getElementById('telefone-c');
    const enderecoInput = document.getElementById('endereco-c');
    const tipoRadios = document.getElementsByName('tipo');

    const TAXA_ENTREGA = 5.00;
    let carrinhoItens = [];

    function carregar() {
        const raw = localStorage.getItem('dourattoCart');
        if (raw) {
            try { carrinhoItens = JSON.parse(raw); } catch(e) { carrinhoItens = []; }
        } else {
            carrinhoItens = [];
        }
        renderizar();
    }

    function salvar() {
        localStorage.setItem('dourattoCart', JSON.stringify(carrinhoItens));
        atualizarTotais();
    }

    function atualizarTotais() {
        const subtotal = carrinhoItens.reduce((s, it) => s + it.preco * (it.qtd || 1), 0);
        subtotalEl.textContent = `Subtotal: R$ ${subtotal.toFixed(2)}`;
        const tipo = [...tipoRadios].find(r => r.checked).value;
        let taxa = tipo === 'entrega' ? TAXA_ENTREGA : 0;
        taxaEl.style.display = taxa > 0 ? 'block' : 'none';
        if (taxa > 0) taxaEl.textContent = `Taxa de entrega: R$ ${taxa.toFixed(2)}`;
        const total = subtotal + taxa;
        totalGeralEl.innerHTML = `<strong>Total: R$ ${total.toFixed(2)}</strong>`;
        localStorage.setItem('dourattoTotal', total.toFixed(2));
    }

    function alterarQuantidade(produto, delta) {
        const item = carrinhoItens.find(i => i.produto === produto);
        if (!item) return;
        item.qtd = Math.max(1, (item.qtd || 1) + delta);
        salvar();
        renderizar();
    }

    function removerItem(produto) {
        carrinhoItens = carrinhoItens.filter(i => i.produto !== produto);
        salvar();
        renderizar();
    }

    function renderizar() {
        listaEl.innerHTML = '';
        if (!carrinhoItens.length) {
            listaEl.innerHTML = '<p>Seu carrinho está vazio.</p>';
            atualizarTotais();
            return;
        }
        carrinhoItens.forEach(item => {
            const div = document.createElement('div');
            div.className = 'checkout-item';
            div.innerHTML = `
                <div class="ci-info">
                    <strong>${item.produto}</strong>
                    <p>Quantidade: ${item.qtd || 1}</p>
                    <p>Preço unitário: R$ ${item.preco.toFixed(2)}</p>
                    <p><em>Subtotal: R$ ${(item.preco * (item.qtd || 1)).toFixed(2)}</em></p>
                </div>
                <div class="ci-controls">
                    <button class="qtd-btn" data-produto="${item.produto}" data-delta="-1">-</button>
                    <span class="qtd">${item.qtd || 1}</span>
                    <button class="qtd-btn" data-produto="${item.produto}" data-delta="1">+</button>
                    <button class="rem-btn" data-produto="${item.produto}">Remover</button>
                </div>
            `;
            listaEl.appendChild(div);
        });

        // eventos
        document.querySelectorAll('.qtd-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const produto = btn.getAttribute('data-produto');
                const delta = parseInt(btn.getAttribute('data-delta'), 10);
                alterarQuantidade(produto, delta);
            });
        });
        document.querySelectorAll('.rem-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const produto = btn.getAttribute('data-produto');
                removerItem(produto);
            });
        });

        atualizarTotais();
    }

    [...tipoRadios].forEach(r => r.addEventListener('change', atualizarTotais));

    finalizarBtn.addEventListener('click', () => {
        if (!carrinhoItens.length) { alert('Seu carrinho está vazio!'); return; }
        const nome = nomeInput.value.trim();
        const tel = telInput.value.trim();
        const tipo = [...tipoRadios].find(r => r.checked).value;
        const endereco = enderecoInput.value.trim();
        if (!nome || !tel) { alert('Preencha nome e telefone.'); return; }
        if (tipo === 'entrega' && endereco.length < 5) { alert('Informe o endereço para entrega.'); return; }

        const subtotal = carrinhoItens.reduce((s, it) => s + it.preco * (it.qtd || 1), 0);
        const taxa = tipo === 'entrega' ? TAXA_ENTREGA : 0;
        const total = subtotal + taxa;

        const pedidoTexto = carrinhoItens.map(item => `• ${item.produto} x${item.qtd || 1} - R$ ${(item.preco * (item.qtd || 1)).toFixed(2)}`).join('\n');

        const mensagem = `🍦 *Pedido Douratto* 🍦\n\nCliente: ${nome}\nTelefone: ${tel}\nTipo: ${tipo}\nEndereço: ${endereco || '---'}\n\n${pedidoTexto}\n\nSubtotal: R$ ${subtotal.toFixed(2)}\nTaxa: R$ ${taxa.toFixed(2)}\n*Total: R$ ${total.toFixed(2)}*`;

        const numeroWhatsApp = "5516994265989"; // <- ajuste para seu número real aqui
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
        window.location.href = url;
    });

    cancelarBtn.addEventListener('click', () => {
        if (!confirm('Deseja cancelar o pedido e limpar o carrinho?')) return;
        carrinhoItens = [];
        salvar();
        localStorage.removeItem('dourattoCart');
        localStorage.removeItem('dourattoTotal');
        window.location.href = 'index.html';
    });

    // inicializa
    const raw = localStorage.getItem('dourattoCart');
    try { carrinhoItens = raw ? JSON.parse(raw) : []; } catch(e) { carrinhoItens = []; }
    renderizar();
});