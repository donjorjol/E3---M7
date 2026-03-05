require('dotenv').config();
const { pool } = require('./pool_db'); 

// 1. Función para INSERTAR
async function insertarTarea(titulo, descripcion) {
    try {
        // Agregamos RETURNING * al final del string
        const consulta = 'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2) RETURNING *';
        const valores = [titulo, descripcion];

        const resultado = await pool.query(consulta, valores);

        // Ahora mostramos la fila completa que nos devolvió el RETURNING
        const fila = resultado.rows[0];
        console.log(`✅ Tarea "${fila.titulo}" insertada. ID generado: ${fila.id}`);
        
        return fila.id; // Retornamos el ID para que la prueba de abajo sea dinámica
    } catch (error) {
        console.error('❌ Error al insertar:', error.message);
    }
}

// 2. Función para ACTUALIZAR
async function actualizarTarea(id, nuevoTitulo, nuevaDescripcion) {
    try {
        // Agregamos RETURNING * para ver cómo quedó la tarea tras el cambio
        const consulta = 'UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3 RETURNING *';
        const valores = [nuevoTitulo, nuevaDescripcion, id];

        const resultado = await pool.query(consulta, valores);

        if (resultado.rowCount > 0) {
            const fila = resultado.rows[0];
            console.log(`🔄 Tarea ID ${fila.id} actualizada a: "${fila.titulo}"`);
        } else {
            console.log(`⚠️ No se encontró la tarea con ID ${id}.`);
        }
    } catch (error) {
        console.error('❌ Error al actualizar:', error.message);
    }
}

// 3. Función para ELIMINAR
async function eliminarTarea(id) {
    try {
        // RETURNING en el DELETE nos permite despedirnos de los datos
        const consulta = 'DELETE FROM tareas WHERE id = $1 RETURNING *';
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rowCount > 0) {
            const fila = resultado.rows[0];
            console.log(`🗑️ Tarea eliminada: "${fila.titulo}" (ID: ${fila.id})`);
        } else {
            console.log(`⚠️ No se pudo eliminar: El ID ${id} no existe.`);
        }
    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
    }
}

// --- ORQUESTACIÓN DE PRUEBAS (Lógica de tus tareas) ---
async function main() {
    console.log('--- 🛠️ Iniciando Pruebas de CRUD con RETURNING ---\n');

    // PASO 1: Insertamos y guardamos el ID real que nos dio la DB
    const idGenerado = await insertarTarea('Estudiar SQL Injection', 'Aprender por qué los marcadores $1 son vitales.');

    // PASO 2: Usamos ese ID real para actualizar (evita el error de ID inexistente)
    if (idGenerado) {
        await actualizarTarea(idGenerado, 'Aprender PostgreSQL', 'Completar todos los ejercicios de la guía.');
        
        // PASO 3: Eliminamos la tarea exacta que creamos
        await eliminarTarea(idGenerado);
    }

    await pool.end();
    console.log('\n--- ✨ Pruebas finalizadas y conexión cerrada ---');
}

main();