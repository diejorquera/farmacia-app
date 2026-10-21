# FarmaciasHoy.cl — instrucciones permanentes del proyecto

## Contexto
Este repositorio contiene el sitio farmaciashoy.cl, un buscador de farmacias que consume datos de una API pública del MINSAL. Confirma el stack vigente en los archivos reales antes de asumir que algo descrito aquí sigue siendo así (según la auditoría ya realizada: React Router v7 en modo framework/SSG, no una SPA plana — ver memoria del proyecto).

El sitio ya tiene páginas orgánicas bien posicionadas y contenido que está dando resultados. La prioridad sigue siendo mejorar la velocidad, la entrega de datos y la mantenibilidad **sin perder URLs, contenido ni señales SEO que ya funcionan**.

## Estado del proyecto
La auditoría inicial ya se completó. Decisión tomada: mantener el stack actual y optimizarlo (no migrar a Astro ni rehacer desde cero). Las optimizaciones derivadas de esa auditoría ya fueron aplicadas y están en la versión final.

No repitas la auditoría completa salvo que el usuario lo pida explícitamente o que el código real contradiga lo documentado en la memoria del proyecto. Si algo no cuadra con lo ya auditado, señálalo como hallazgo nuevo en vez de descartarlo.

## Reglas de trabajo
- Responde en español claro, práctico y orientado a una persona con conocimientos de desarrollo web, sin asumir experiencia avanzada en arquitectura o DevOps.
- Antes de cambiar código: confirma el alcance concreto del cambio con el usuario si no es evidente, y cómo se va a validar antes de darlo por bueno.
- No instales dependencias nuevas, no ejecutes despliegues, no modifiques configuración de Vercel, DNS, NIC Chile, APIs ni servicios externos, salvo autorización expresa para ese cambio puntual.
- No leas ni imprimas `.env`, tokens, claves, credenciales, cookies o secretos. Puedes comprobar que existan archivos de configuración sensibles, pero no mostrar sus contenidos.
- Excluye del análisis masivo `node_modules`, `.git`, `dist`, `build`, cachés, bundles generados y otros directorios de salida. Lee archivos de origen y configuración de forma dirigida.
- No vuelques archivos enteros por defecto. Usa búsquedas puntuales y fragmentos relevantes; resume hallazgos para ahorrar contexto y tokens.
- Sustenta cada cambio con la ruta del archivo y, cuando sea útil, nombre de función/componente o fragmento breve.
- No inventes límites, precios, cuotas, tiempos de respuesta de MINSAL/Vercel ni comportamientos de APIs ni de políticas de servicios externos (ej. AdSense). Verifica antes de asumir.
- No reescribas textos posicionados ni cambies slugs, mayúsculas/minúsculas, trailing slash, canonical, metadatos o enlaces internos sin justificar el impacto y definir cómo validarlo antes de aplicarlo.
- Evita añadir dependencias por comodidad. Evalúa primero lo que ya existe.
- No hagas pruebas de carga agresivas contra la API pública del MINSAL.

## Precisión técnica
No atribuyas automáticamente un problema de rendimiento a "el framework" sin verificar cómo se generan y sirven las rutas, cuándo se crean las páginas, qué JavaScript se envía al navegador y cuándo se solicita la API, en el código real y actual.

## Entrega de cambios
Cada cambio propuesto o aplicado debe incluir:
1. Qué cambia y por qué.
2. Archivos afectados.
3. Impacto en SEO/Core Web Vitals si aplica, y cómo se valida.
4. Condición de rollback si algo falla.
5. Próxima acción mínima recomendada.
