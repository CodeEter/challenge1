await IngameRentNFT.update(
    { status: "Available", total_days_spent_renting: Sequelize.literal('total_days_spent_renting + duration') },
    { where: { id: nftSerialIds }, transaction: transaction },

  );