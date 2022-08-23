const templatesSeeder = (server) => {
  server.createList('template', 50);
};

export default function seeds(server) {
  templatesSeeder(server);
}
