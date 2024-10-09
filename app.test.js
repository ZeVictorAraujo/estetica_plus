const { getUserById, connection } = require('./db.js');

describe('Testes de integração para Estética Plus', () => {

    beforeAll(async () => {
        await connection.query("DELETE FROM agenda");
    });

    test('1 - Verificar se um usuário pode ser criado.', async () => {
        await connection.query("INSERT INTO agenda (nome_pessoa, contato_telefonico, email, data_agendamento) VALUES ('Victor Araujo', '75999604987', 'jose@hotmail.com', '2024-10-08')");

        const [result] = await connection.query("SELECT nome_pessoa, contato_telefonico, email, data_agendamento FROM agenda WHERE email = 'jose@hotmail.com'");
        const user = result[0];

        const dataAgendamento = user.data_agendamento.toISOString().split('T')[0];

        expect(user).toHaveProperty('nome_pessoa', 'Victor Araujo');
        expect(user).toHaveProperty('contato_telefonico', '75999604987');
        expect(user).toHaveProperty('email', 'jose@hotmail.com');
        expect(dataAgendamento).toBe('2024-10-08');
    });

    test('2 - Ler toda a tabela', async () => {
        const [rows] = await connection.query("SELECT * FROM agenda");
        expect(rows.length).toBeGreaterThan(0);
    });

    test('3 - Leitura de agendamento por nome específico', async () => {
        const [rows] = await connection.query("SELECT * FROM agenda WHERE nome_pessoa = 'Victor Araujo'");
        expect(rows.length).toBe(1);
        expect(rows[0].nome_pessoa).toBe('Victor Araujo');
    });

    test('4 -Selecionar por parte do nome', async () => {
        const [rows] = await connection.query("SELECT * FROM agenda WHERE nome_pessoa LIKE '%Victor%'");
        expect(rows.length).toBeGreaterThan(0);
    });

    test('5 - Selecionar por intervalo de datas', async () => {
        const [rows] = await connection.query("SELECT * FROM agenda WHERE data_agendamento BETWEEN '2024-01-01' AND '2024-12-31'");
        expect(rows.length).toBeGreaterThan(0);
    });

    test('6 - Atualizar um agendamento existente', async () => {
        const result = await connection.query(`
            UPDATE agenda 
            SET nome_pessoa = 'Jose Araujo' 
            WHERE nome_pessoa = 'Victor Araujo'
        `);
        expect(result[0].affectedRows).toBe(1);


        const [rows] = await connection.query("SELECT * FROM agenda WHERE nome_pessoa = 'Jose Araujo'");
        expect(rows.length).toBe(1);
        expect(rows[0].nome_pessoa).toBe('Jose Araujo');
    });


    test('7 - Deletar um agendamento existente', async () => {
        const result = await connection.query("DELETE FROM agenda WHERE nome_pessoa = 'Jose Araujo'");
        expect(result[0].affectedRows).toBe(1); 

        const [rows] = await connection.query("SELECT * FROM agenda WHERE nome_pessoa = 'Jose Araujo'");
        expect(rows.length).toBe(0);
    });

    test('8 - Teste de perfomance em menos de 200ms', async () => {
       const inicio = performance.now();
       await getUserById(1);
       const fim = performance.now();

       const duracao = fim - inicio;
       console.log(`Tempo de execução: ${duracao.toFixed(2)} ms`);

       expect(duracao).toBeLessThanOrEqual(100)
    });

    afterAll(async () => {
        await connection.query("DELETE FROM agenda");
        await connection.end();
    });
});
