// app.js — Botões para enviar o sabor direto no WhatsApp
document.addEventListener('DOMContentLoaded', () => {
  const botoes = document.querySelectorAll('.pedir');
  const numeroWhatsApp = '5516994265989'; // coloque aqui o número do WhatsApp que recebe pedidos

  botoes.forEach(btn => {
    btn.addEventListener('click', () => {
      const produto = btn.getAttribute('data-produto');
      const preco = btn.getAttribute('data-preco');
      const mensagem = `🍦 Olá! Gostaria de pedir o sabor *${produto}* (R$ ${preco}).`;
      const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(url, '_blank');
    });
  });
});
