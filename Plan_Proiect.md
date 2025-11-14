# Aplicatie Web pentru Acordarea Anonima de Note 

1. Descriere

    Aplicatia permite evaluarea anonima a proiectelor studentilor de catre un juriu formata aleatoriu din alti studenti. Studentii pot inscrie proiecte, pot defini livrabile partiale si pot fi selectati aleatoriu pentru a evalua proiectele altor colegi.

    Nota finala se calculeaza prin eliminarea celei mai mari si celei mai mici note, note de la 1-10, cu 2 cifre fractionare.

    Profesorul vede evaluarile studentilor pentru fiecare proiect, fara sa aiba acces la identitatea juratilor.

2. Tehnologii utilizate
    -Frontend: React.js (single page application)
    -Backend: Node.js + Express.js (REST API)
    -ORM: Prisma
    -Baza de Date: PostgreSQL
    -Versionare: Git
    -Deploy: 
            -Frontend si Backend: Render
            - Baza de Date: Neon


3. Roluri de utilizatori
    
    - Student, Membru de proiect(MP):
        - inscrie un proiect
        - defineste livrabile partiale
        - adauga video demonstativ sau link pentru demo
        - devine automat membru al grupului posibil de evaluatori pentru alte proiecte

    - Student, Evaluator:
        - este selectaat aleatoriu pentru a evalua un livrabil
        - acorda nota doar proiectelor unde a fost asignat in echipa de jurati
        - poate modifica  doar nota lui in perioada determinata
        - nota este complet anonima

    - Profesor: 
        - vizualizeaza evaluarile proiectelor
        - vede nota finala 
        - nu poate vedea identitatea evaluatorilor 

4. Functionalitati

    - Autentificare si permisiuni:
        - Login/Register cu email si parola
        - JWT pentru sesiune
        - Permisiuni pe roluri: student MP, student evaluator, profesor
        - Doar juratii asignati proiectului pot adauga note si modifca propia nota

        - Gestionare  proiecte (pentru MP)
            - creare proiect 
            - definire livrabile partiale 
            - editatarea livrabilelor
            - adaugare video/link demo

        - Selectarea juriului
            - la data unui livrabil partial, serverul selecteaza aleatoriu un set de studenti
            - membrii echipei proiectului sunt exclusi automat
            - fiecare jurat primeste un termen pana poate completa evaluarea

        - Acordarea notelor
            - nota poate fi acordata doar de juratii asignati
            - nota intre 1.00 si 10.00, cu pana la 2 zecimale
            - nota poate fi modificata doar pana la termen 
            - nota este anonima
            - se accepta doar o nota per evaluator per livrabil

        - Calculul notei finale 
            - nota finala se calculeaza astfel: media notelor dupa eliminarea celei mai mari si celei mai mici note
            - MP vede doar nota finala
            - Profesorul vede notele individuale si nota finala

5. Model de date    
    - Utilizator:
        - id - String (cuid)
        - nume - String
        - email - String (unic)
        - password - String hashuit
        - rol - Enum (Student, Teacher)

    - Proiect:
        - id - String (cuid)
        - titlu - String
        - descriere - String
        - ownerId - String (FK - Utilizator.id)
        
    - Livrabil:
        - id - String (cuid)
        - proiectId - String (FK - Proiec.id)
        - titlu - String
        - descriere - String
        - deadline -DateTime
        - demoUrl - String (optional)

    - AsignareJuriu:
        - id - String (cuid)
        - livrabilId - String ( FK - Livrabil.Id)
        - evaluatorId - String (FK - Utilizator.Id)
        - assignedAt - DateTime
        - expiresAt - DateTime

    - Nota:
        -  id - String (cuid)
        - juriuId - String (FK - AsignareJuriu.id)
        - scor - Decimal(4,2)
        - createdAt - DateTime
        - updatedAt - DateTime

*cuid() - functie din Prisma ORM care genereaza automat Collision-Resistant ID



6.  API REST

    - Autentificare:
        - POST /auth/register
        - POST /auth/login
        - GET /auth/me
    
    - Proiecte:
        - POST /projects
        - GET /projects
        - GET /projects/:id

    - Livrabile:
        - POST /projects/:projectId/deliverables
        - GET /projects/:projectId/delivarables
        - PATCH /deliverables/:id/demo-url

    - Asignare juriu:
        - POST /deliverables/:livrabilId/assign-jury
        - GET /my-assignments

    - Nota: 
        - POST /deliverables/:livrabilId/grade
        - GET /deliverables/:livrabilId/grades



-
# Plan de Proiect 
    - Configurare:
        - Schelet foldere pentru backend
        - Structura pagina  web frontend
        - Creeare model Prisma
        - Configurare bazei de date in Neon

    - Implementare Backend:
        - implementare autentificare cu JWT
        - realizarea rutelor 
        - implementarea mecanismului de asignare aleatorie
        - sistemul de notare
        - calcul automat al notei
        - testare API calls in Postman
        - deploy in Render

    - Implementarea frontend:
        - creeare pagina login
        - dashboard pentru MP : proiecte,livrabil, adaugare demo
        - pagina pentru livrabil, cu afisare link video/demo
        - dashboard pentru profesor: vizualiarea notelor indiviudale si nota finala per proiect
        - integrare cu backend prin API calls
        - Deploy pe Render 

    - Testare:
        - Testatre prin scenarii pentru a verifica comportamentul aplicatiei
        - Corectarea bug-urilor identificate
        - Deploy final
        - Pregatirea prezentarii pentru demo
    

    

        


        

