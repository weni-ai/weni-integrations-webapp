const templatesSeeder = (server) => {
  server.createList('template', 10);
};

export default function seeds(server) {
  templatesSeeder(server);
}
