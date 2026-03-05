require('dotenv').config();
const { pool } = require('./pool_db'); 
// 1. Función para INSERTAR una nueva tarea
async function insertarTarea(titulo, descripcion) {
    try {
        const consulta = 'INSERT INTO tareas (titulo, descripcion) VALUES ($1, $2)';
        const valores = [titulo, descripcion];

        const resultado = await pool.query(consulta, valores);

        // Confirmamos usando rowCount
        console.log(`✅ Tarea "${titulo}" insertada con éxito. Filas afectadas: ${resultado.rowCount}`);
    } catch (error) {
        console.error('❌ Error al insertar:', error.message);
    }
}

// 2. Función para ACTUALIZAR una tarea existente
async function actualizarTarea(id, nuevoTitulo, nuevaDescripcion) {
    try {
        const consulta = 'UPDATE tareas SET titulo = $1, descripcion = $2 WHERE id = $3';
        const valores = [nuevoTitulo, nuevaDescripcion, id];

        const resultado = await pool.query(consulta, valores);

        if (resultado.rowCount > 0) {
            console.log(`🔄 Tarea con ID ${id} actualizada. Filas afectadas: ${resultado.rowCount}`);
        } else {
            console.log(`⚠️ No se encontró la tarea con ID ${id} (0 filas afectadas).`);
        }
    } catch (error) {
        console.error('❌ Error al actualizar:', error.message);
    }
}

// 3. Función para ELIMINAR una tarea
async function eliminarTarea(id) {
    try {
        const consulta = 'DELETE FROM tareas WHERE id = $1';
        const valores = [id];

        const resultado = await pool.query(consulta, valores);

        if (resultado.rowCount > 0) {
            console.log(`🗑️ Tarea con ID ${id} eliminada. Filas afectadas: ${resultado.rowCount}`);
        } else {
            console.log(`⚠️ No se pudo eliminar: El ID ${id} no existe.`);
        }
    } catch (error) {
        console.error('❌ Error al eliminar:', error.message);
    }
}

// --- ORQUESTACIÓN DE PRUEBAS ---
async function main() {
    console.log('--- 🛠️ Iniciando Pruebas de CRUD ---\n');

    await insertarTarea('Estudiar SQL Injecton', 'Aprender por qué los marcadores $1 son vitales.');

    // Actualizamos la tarea inicial 
    await actualizarTarea(1, 'Aprender PostgreSQL', 'Completar todos los ejercicios de la guía de base de datos.');

    // Intentamos eliminar la tarea que acabamos de crear 
    await eliminarTarea(2);

    // Cerramos la conexión al terminar
    await pool.end();
    console.log('\n--- ✨ Pruebas finalizadas y conexión cerrada ---');
}

main();