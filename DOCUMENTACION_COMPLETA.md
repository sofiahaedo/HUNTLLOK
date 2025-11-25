# 📖 DOCUMENTACIÓN COMPLETA DEL JUEGO HUNTLLOK
*Explicado para que cualquier persona pueda entender cómo funciona*

---

## 🎮 ¿QUÉ ES HUNTLLOK?

HUNTLLOK es un juego de caza donde controlas a un cazador que debe sobrevivir cazando animales en un mundo peligroso. El objetivo es conseguir la mayor cantidad de puntos posible sin morir.

---

## 🏗️ ESTRUCTURA DEL JUEGO

### 📁 Archivos Principales

El juego está dividido en varios archivos, cada uno con una función específica:

#### 🌐 **index.html** - La Ventana del Juego
- **¿Qué hace?**: Es como el "marco" de una ventana donde se muestra todo el juego
- **Contiene**: 
  - El menú principal con botones
  - La pantalla de juego donde aparecen los personajes
  - Las pantallas de puntajes e instrucciones
  - La barra de vida y munición

#### 🎯 **main.js** - El Iniciador
- **¿Qué hace?**: Es como el "botón de encendido" del juego
- **Función principal**: 
  - Detecta si juegas en teléfono o computadora
  - Configura los controles del teclado
  - Muestra el menú principal cuando abres el juego

#### 🎲 **juego.js** - El Cerebro Principal
- **¿Qué hace?**: Es como el "director" que controla todo lo que pasa
- **Responsabilidades**:
  - Crear y mover a todos los animales
  - Detectar cuando las balas tocan a los animales
  - Contar los puntos y la vida
  - Cambiar entre pantallas (menú, juego, puntajes)
  - Pausar y reiniciar el juego

---

## 👤 PERSONAJES DEL JUEGO

### 🏹 **cazador.js** - El Protagonista
**¿Quién es?**: El personaje que tú controlas

**Características**:
- **Vida**: 100 puntos (si llega a 0, pierdes)
- **Velocidad**: Se mueve a 3 píxeles por frame
- **Armas**: Puede usar 3 tipos diferentes
- **Tamaño**: 40x40 píxeles en pantalla

**Habilidades**:
- **Moverse**: Con las teclas WASD
- **Disparar**: Con las flechas del teclado
- **Cambiar armas**: Con las teclas 1, 2, 3
- **Recargar**: Con la tecla R

**Sistema de Daño**:
- Cuando recibe daño, parpadea en rojo
- Puede recibir ataques de osos (20 de daño) y dinosaurios (50 de daño)

### 🐰 **animales.js** - Los Objetivos y Enemigos

#### **Conejo** 🐰
- **Vida**: 25 puntos
- **Puntos por cazar**: 10
- **Comportamiento**: Huye del cazador cuando se acerca
- **Velocidad**: 1.5 (muy rápido)
- **Peligro**: Ninguno (no ataca)

#### **Ciervo** 🦌
- **Vida**: 75 puntos
- **Puntos por cazar**: 30
- **Comportamiento**: Huye del cazador cuando se acerca
- **Velocidad**: 2 (rápido)
- **Peligro**: Ninguno (no ataca)

#### **Oso** 🐻
- **Vida**: 150 puntos
- **Puntos por cazar**: 50
- **Comportamiento**: Persigue al cazador para atacarlo
- **Velocidad**: 1 (lento pero peligroso)
- **Peligro**: ALTO - Hace 20 de daño cada segundo

#### **Dinosaurio** 🦕
- **Vida**: 200 puntos
- **Puntos por cazar**: 150
- **Comportamiento**: Persigue al cazador agresivamente
- **Velocidad**: 2 (rápido y peligroso)
- **Peligro**: EXTREMO - Hace 50 de daño cada 0.75 segundos

---

## 🔫 SISTEMA DE ARMAS

### **armas.js** - El Arsenal

#### **Pistola** 🔫
- **Daño**: 25 por bala
- **Munición**: 15 balas por cargador
- **Cargadores**: 5 totales
- **Mejor para**: Conejos y ciervos

#### **Rifle** 🎯
- **Daño**: 50 por bala
- **Munición**: 8 balas por cargador
- **Cargadores**: 4 totales
- **Mejor para**: Osos y objetivos medianos

#### **Escopeta** 💥
- **Daño**: 75 por bala
- **Munición**: 5 balas por cargador
- **Cargadores**: 3 totales
- **Mejor para**: Dinosaurios y emergencias

---

## 💥 SISTEMA DE BALAS

### **bala.js** - Los Proyectiles

**¿Qué hacen las balas?**:
- Viajan en línea recta a 8 píxeles por frame
- Tienen animación giratoria mientras vuelan
- Desaparecen si salen de la pantalla
- Al tocar un animal, le hacen daño y desaparecen

**Sistema de Colisión**:
- Cada bala tiene una "hitbox" (área de impacto) de 10x10 píxeles
- Cuando esta área toca la hitbox de un animal, ocurre el impacto

---

## 🏆 SISTEMA DE PUNTAJES

### **puntajes.js** - El Marcador

**¿Cómo funciona?**:
- Guarda los 5 mejores puntajes en la memoria del navegador
- Cada vez que cazas un animal, sumas puntos
- Al morir, puedes guardar tu puntaje con tu nombre
- Los puntajes se ordenan de mayor a menor

---

## 🎮 MECÁNICAS DEL JUEGO

### 🔄 **El Bucle Principal** (Game Loop)
El juego funciona como una película que se reproduce 60 veces por segundo:

1. **Actualizar**: Mueve a todos los personajes
2. **Detectar Colisiones**: Ve si algo choca con algo
3. **Dibujar**: Pinta todo en la pantalla
4. **Repetir**: Vuelve al paso 1

### 🎯 **Sistema de Colisiones**
**¿Cómo sabe el juego cuando algo toca algo?**

Cada personaje tiene dos tamaños:
- **Tamaño Visual**: Lo que ves en pantalla (40x40 píxeles)
- **Hitbox**: El área real de colisión (más pequeña, centrada en el cuerpo)

Ejemplo del Cazador:
- Tamaño visual: 40x40 píxeles
- Hitbox: 18x22 píxeles (centrada en el torso)

### 🏃 **Sistema de Movimiento**

**Cazador**:
- Usa las teclas WASD para moverse
- No puede salirse de la pantalla (800x420 píxeles)
- No puede atravesar animales

**Animales**:
- **Conejos y Ciervos**: Huyen cuando el cazador se acerca
- **Osos y Dinosaurios**: Persiguen al cazador para atacar
- Todos se mueven aleatoriamente cuando no detectan al cazador

### 🎨 **Sistema de Animación**

Todos los personajes usan "spritesheets" (hojas de sprites):
- Son imágenes grandes con muchos frames pequeños
- Cada frame es de 64x64 píxeles
- El juego cambia de frame rápidamente para crear animación
- Diferentes filas para diferentes direcciones (arriba, abajo, izquierda, derecha)

---

## 🎛️ CONTROLES DEL JUEGO

### ⌨️ **En el Menú**:
- **1**: Jugar
- **2**: Ver tabla de puntajes
- **3**: Ver instrucciones
- **4**: Salir del juego

### 🎮 **Durante el Juego**:
- **W, A, S, D**: Mover al cazador
- **Flechas**: Disparar en esa dirección
- **1, 2, 3**: Cambiar arma
- **R**: Recargar arma
- **P**: Pausar/despausar
- **Enter**: Reiniciar (cuando mueres)
- **Escape**: Volver al menú

---

## 🔧 FUNCIONAMIENTO TÉCNICO SIMPLIFICADO

### 🖥️ **¿Cómo se ve todo en pantalla?**

1. **Canvas**: Es como un lienzo digital de 800x420 píxeles
2. **Contexto 2D**: Es el "pincel" que dibuja en el lienzo
3. **Frames**: El juego se redibuja 60 veces por segundo
4. **Coordenadas**: Cada objeto tiene posición X,Y en el lienzo

### 🧠 **¿Cómo "piensa" el juego?**

1. **Clases**: Son como "moldes" para crear personajes
   - Clase Cazador → Crea al cazador
   - Clase Conejo → Crea conejos
   - Clase Bala → Crea balas

2. **Objetos**: Son los personajes creados con esas clases
   - `juego.cazador` = el cazador en pantalla
   - `juego.animales[]` = lista de todos los animales
   - `juego.balas[]` = lista de todas las balas

3. **Métodos**: Son las "acciones" que pueden hacer
   - `cazador.disparar()` = crear una bala
   - `animal.perseguir()` = moverse hacia el cazador
   - `bala.actualizar()` = moverse por la pantalla

### 📊 **¿Cómo se guardan los datos?**

- **Variables**: Guardan información temporalmente
  - `cazador.vida = 100` (vida actual)
  - `cazador.puntos = 250` (puntos acumulados)

- **LocalStorage**: Guarda puntajes permanentemente en tu navegador
  - Incluso si cierras el juego, los puntajes se mantienen

---

## 🎯 ESTRATEGIAS DE JUEGO

### 🥇 **Para Principiantes**:
1. Mantente alejado de osos y dinosaurios
2. Caza conejos y ciervos primero (son seguros)
3. Usa la pistola para ahorrar munición valiosa
4. Recarga cuando tengas tiempo seguro

### 🏆 **Para Expertos**:
1. Usa la escopeta contra dinosaurios (3 disparos los mata)
2. Usa el rifle contra osos (3 disparos los mata)
3. Mantén distancia y dispara mientras retrocedes
4. Aprende los patrones de movimiento de cada animal

---

## 🐛 CARACTERÍSTICAS ESPECIALES

### ✨ **Efectos Visuales**:
- **Parpadeo de daño**: El cazador parpadea en rojo al recibir daño
- **Animaciones de muerte**: Los animales muestran imagen especial al morir
- **Barra de vida**: Cambia de color según la vida restante
- **Sprites direccionales**: Los personajes miran hacia donde se mueven

### 🎵 **Sistema de Estados**:
- **Menú**: Pantalla inicial con opciones
- **Jugando**: El juego activo
- **Pausado**: Juego detenido temporalmente
- **Game Over**: Pantalla de fin de juego
- **Puntajes**: Tabla de mejores jugadores

---

## 🔍 DETALLES TÉCNICOS AVANZADOS

### 📐 **Sistema de Coordenadas**:
- Origen (0,0) está en la esquina superior izquierda
- X aumenta hacia la derecha
- Y aumenta hacia abajo
- Límites: X(0-800), Y(0-420)

### ⚡ **Optimizaciones**:
- Usa `requestAnimationFrame` en lugar de `setInterval` para mejor rendimiento
- Las hitboxes son más pequeñas que los sprites para colisiones precisas
- Los sprites se cargan una vez y se reutilizan
- Los objetos inactivos se eliminan de memoria

### 🎨 **Gestión de Recursos**:
- Todas las imágenes se cargan al inicio
- Sistema de fallback si las imágenes no cargan
- Logs de consola para debug y seguimiento

---

## 🎊 CONCLUSIÓN

HUNTLLOK es un juego completo que combina:
- **Acción**: Disparos y persecuciones
- **Estrategia**: Gestión de munición y posicionamiento
- **Supervivencia**: Evitar enemigos peligrosos
- **Progresión**: Sistema de puntajes y mejores marcas

El código está organizado de manera modular, donde cada archivo tiene una responsabilidad específica, haciendo el juego fácil de mantener y expandir.

---

*Esta documentación explica cómo funciona cada parte del juego HUNTLLOK de manera que cualquier persona, sin importar su nivel de conocimiento en programación, pueda entender la lógica y mecánicas detrás del juego.*