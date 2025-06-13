const db = require("../database");

async function createOrder(accountId, deliveryAddress, receiverName, cartItems) {
    try {
        // Cria o pedido
        const orderSql = `
            INSERT INTO orders (account_id, delivery_address, receiver_name, order_date)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
            RETURNING order_id
        `;
        const orderResult = await db.query(orderSql, [
            accountId,
            deliveryAddress,
            receiverName
        ]);
        const orderId = orderResult.rows[0].order_id;

        // Insere os itens do pedido
        const orderItemSql = `
            INSERT INTO order_items (order_id, car_id, quantity, price)
            VALUES ($1, $2, $3, $4)
        `;

        for (const item of cartItems) {
            await db.query(orderItemSql, [
                orderId,
                item.car_id,
                item.quantity,
                item.inv_price
            ]);
        }

        return orderId;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
}

module.exports = { createOrder };
