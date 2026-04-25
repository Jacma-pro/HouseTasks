import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { errorHandler, createError } from '../../middleware/errorHandler';
import type { AppError } from '../../types';

function mockRes() {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as Response;
}

describe('createError', () => {
  it('crée une erreur avec le bon message et statusCode', () => {
    const err = createError('Non trouvé', 404);
    expect(err.message).toBe('Non trouvé');
    expect(err.statusCode).toBe(404);
    expect(err).toBeInstanceOf(Error);
  });

  it('crée une erreur 500 par défaut si statusCode non fourni', () => {
    const err = new Error('crash') as AppError;
    expect(err.statusCode).toBeUndefined();
  });
});

describe('errorHandler', () => {
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    res = mockRes();
    next = vi.fn() as unknown as NextFunction;
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('répond 404 avec le message de l\'erreur', () => {
    const err = createError('Ressource introuvable', 404);
    errorHandler(err, {} as Request, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ressource introuvable' });
  });

  it('répond 400 avec le message de l\'erreur', () => {
    const err = createError('Données invalides', 400);
    errorHandler(err, {} as Request, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Données invalides' });
  });

  it('utilise 500 et logue quand statusCode absent', () => {
    const err = new Error('crash inattendu') as AppError;
    errorHandler(err, {} as Request, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'crash inattendu' });
    expect(console.error).toHaveBeenCalled();
  });

  it('répond "Erreur interne du serveur" si pas de message', () => {
    const err = {} as AppError;
    errorHandler(err, {} as Request, res, next);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erreur interne du serveur' });
  });
});
