const { z } = require('zod');

exports.approvalSchema = z.object({
  body: z.object({
    status: z.enum(['Approved', 'Rejected', 'Modification Required']),
    comments: z.string().optional(),
  }),
  params: z.object({
    approvalId: z.string().uuid(),
  }),
});
