import { sequelize } from '../config/database.js';
import '../models/User.js';
import '../models/Product.js';
import '../models/Client.js';
import '../models/Vacancy.js';
import '../models/Application.js';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Vacancy } from '../models/Vacancy.js';
import { env } from '../config/env.js';

async function run() {
  try {
    console.log('Conectando a DB...');
    await sequelize.authenticate();
    await sequelize.sync();

    const users = [
      { name: 'Admin', email: 'admin@riwi.com', password: 'admin123', role: 'admin' as const },
      { name: 'Gestor', email: 'gestor@riwi.com', password: 'gestor123', role: 'gestor' as const },
      { name: 'Coder', email: 'coder@riwi.com', password: 'coder123', role: 'coder' as const },
    ];
    for (const data of users) {
      const exists = await User.findOne({ where: { email: data.email } });
      if (!exists) {
        const password = await bcrypt.hash(data.password, 10);
        await User.create({ name: data.name, email: data.email, password, role: data.role });
        console.log(`Usuario ${data.role} creado: ${data.email} / ${data.password}`); // dejo creds aquí para pruebas rápidas
      } else {
        console.log(`Usuario ${data.email} ya existe`);
      }
    }

    const count = await Product.count();
    if (count === 0) {
      await Product.bulkCreate([
        { name: 'Balón fútbol', price: 29.99, stock: 50 },
        { name: 'Tenis running', price: 79.5, stock: 20 },
        { name: 'Guantes gym', price: 12.0, stock: 100 },
      ]);
      console.log('Productos de ejemplo insertados');
    } else {
      console.log('Productos ya existen');
    }

    const vacanciesCount = await Vacancy.count();
    if (vacanciesCount === 0) {
      await Vacancy.bulkCreate([
        {
          title: 'Backend Node.js',
          description: 'API REST con NestJS y PostgreSQL',
          technologies: 'Node.js, NestJS, PostgreSQL',
          seniority: 'Mid',
          softSkills: 'Comunicación, trabajo en equipo',
          location: 'Medellín',
          modality: 'hibrido',
          salaryRange: '6M - 8M COP',
          company: 'Aliado Riwi',
          maxApplicants: 3,
        },
        {
          title: 'Frontend React',
          description: 'Crear SPA consumiendo APIs de empleabilidad',
          technologies: 'React, Tailwind, Vite',
          seniority: 'Junior',
          softSkills: 'Proactividad, aprendizaje continuo',
          location: 'Bogotá',
          modality: 'remoto',
          salaryRange: '4M - 6M COP',
          company: 'Startup EdTech',
          maxApplicants: 5,
        },
      ]);
      console.log('Vacantes de ejemplo insertadas');
    } else {
      console.log('Vacantes ya existen');
    }

    console.log('Seed completado');
  } catch (e) {
    console.error('Error en seed:', e);
  } finally {
    await sequelize.close();
  }
}

run();
